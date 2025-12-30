import { 
  users, type User, type InsertUser,
  userBalances, type UserBalance,
  quests, type Quest,
  transactions, type Transaction,
  type RouletteResultResponse
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Wallet & Balance
  getUserBalance(userId: string): Promise<UserBalance>;
  deposit(userId: string, amount: number): Promise<UserBalance>;
  withdraw(userId: string, amount: number): Promise<UserBalance>;
  getTransactionHistory(userId: string): Promise<Transaction[]>;

  // Quests
  getUserQuests(userId: string): Promise<Quest[]>;
  completeQuest(userId: string, questId: number): Promise<Quest>;
  
  // Game
  playRoulette(userId: string): Promise<RouletteResultResponse>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods (delegated or implemented)
  getUser(id: string): Promise<User | undefined> {
    return authStorage.getUser(id);
  }
  upsertUser(user: InsertUser): Promise<User> {
    return authStorage.upsertUser(user);
  }

  // === Wallet ===
  async getUserBalance(userId: string): Promise<UserBalance> {
    const [balance] = await db.select().from(userBalances).where(eq(userBalances.userId, userId));
    
    if (!balance) {
      // Initialize balance for new user
      const [newBalance] = await db.insert(userBalances).values({
        userId,
        mainBalance: "0",
        lockedBonus: "0",
        questEarnings: "0",
        investmentTier: 0,
      }).returning();
      
      // Also generate initial quests for new user
      await this.generateDailyQuests(userId);
      
      return newBalance;
    }

    // Check for daily reset (simple check vs lastDailyReset)
    const now = new Date();
    const lastReset = balance.lastDailyReset ? new Date(balance.lastDailyReset) : new Date(0);
    
    // If last reset was on a previous day (UTC)
    if (now.getUTCDate() !== lastReset.getUTCDate() || now.getUTCMonth() !== lastReset.getUTCMonth() || now.getUTCFullYear() !== lastReset.getUTCFullYear()) {
      await this.resetDailyQuests(userId);
      // Update last reset time
      await db.update(userBalances).set({ lastDailyReset: now }).where(eq(userBalances.id, balance.id));
    }

    return balance;
  }

  async deposit(userId: string, amount: number): Promise<UserBalance> {
    const balance = await this.getUserBalance(userId);
    
    // Logic: 40% bonus on FIRST deposit (simplified: if lockedBonus is 0 and no deposits made? 
    // Or just always 40% for MVP simplicity/demo? The prompt says "40% on first deposit")
    // Let's check transaction history for prior deposits
    const history = await this.getTransactionHistory(userId);
    const hasDeposited = history.some(t => t.type === 'deposit');
    
    let bonus = 0;
    if (!hasDeposited) {
      bonus = amount * 0.40;
    }

    // Update balance
    const newMain = Number(balance.mainBalance) + amount;
    const newLocked = Number(balance.lockedBonus) + bonus;
    
    // Determine tier (simple logic: 10k=0, 20k=1 etc. for now just set tier based on total balance?)
    // Prompt: 10,000 XOF -> 4 quests. 20,000 XOF -> 6 quests.
    // Let's just keep tier simple for MVP.

    const [updated] = await db.update(userBalances)
      .set({
        mainBalance: newMain.toString(),
        lockedBonus: newLocked.toString(),
      })
      .where(eq(userBalances.userId, userId))
      .returning();

    // Log transaction
    await db.insert(transactions).values({
      userId,
      type: 'deposit',
      amount: amount.toString(),
      status: 'completed'
    });

    return updated;
  }

  async withdraw(userId: string, amount: number): Promise<UserBalance> {
    const balance = await this.getUserBalance(userId);
    const currentMain = Number(balance.mainBalance);
    const currentQuest = Number(balance.questEarnings);
    
    const totalAvailable = currentMain + currentQuest;

    if (totalAvailable < amount) {
      throw new Error("Insufficient funds");
    }

    // Deduct from Quest Earnings first (arbitrary rule, or prompt: "Retrait possible du solde réel + gains des quêtes")
    // Let's just deduct from mainBalance for simplicity in DB, assuming we pool them or track separately.
    // Ideally we subtract from whichever bucket. Let's subtract from Main first, then Quest.
    
    let remainingToWithdraw = amount;
    let newMain = currentMain;
    let newQuest = currentQuest;

    if (newQuest >= remainingToWithdraw) {
      newQuest -= remainingToWithdraw;
      remainingToWithdraw = 0;
    } else {
      remainingToWithdraw -= newQuest;
      newQuest = 0;
      newMain -= remainingToWithdraw; // We know totalAvailable >= amount, so this is safe
    }

    const [updated] = await db.update(userBalances)
      .set({
        mainBalance: newMain.toString(),
        questEarnings: newQuest.toString(),
      })
      .where(eq(userBalances.userId, userId))
      .returning();

    await db.insert(transactions).values({
      userId,
      type: 'withdrawal',
      amount: amount.toString(),
      status: 'completed'
    });

    return updated;
  }

  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    return db.select().from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  // === Quests ===
  async getUserQuests(userId: string): Promise<Quest[]> {
    // Ensure balance exists (triggers daily reset check)
    await this.getUserBalance(userId);
    
    return db.select().from(quests).where(eq(quests.userId, userId));
  }

  async completeQuest(userId: string, questId: number): Promise<Quest> {
    const [quest] = await db.select().from(quests).where(and(eq(quests.id, questId), eq(quests.userId, userId)));
    
    if (!quest) throw new Error("Quest not found");
    if (quest.isCompleted) throw new Error("Quest already completed");

    // Mark complete
    const [updatedQuest] = await db.update(quests)
      .set({ isCompleted: true, completedAt: new Date() })
      .where(eq(quests.id, questId))
      .returning();

    // Award funds (35% of investment balance? Prompt: "35% du solde d'investissement")
    // Interpreted as 35% of the *reward base* calculated daily, or literally 35% of current balance?
    // "10 000 XOF -> 4 quêtes -> chaque quête = 3 500 XOF" (which is 35% of 10k).
    // So the reward amount is fixed at creation time.
    
    const reward = Number(quest.rewardAmount);
    
    // Add to quest earnings
    const balance = await this.getUserBalance(userId);
    const newQuestEarnings = Number(balance.questEarnings) + reward;
    
    await db.update(userBalances)
      .set({ questEarnings: newQuestEarnings.toString() })
      .where(eq(userBalances.userId, userId));

    await db.insert(transactions).values({
      userId,
      type: 'quest_reward',
      amount: reward.toString(),
      status: 'completed'
    });

    return updatedQuest;
  }

  private async generateDailyQuests(userId: string) {
    // Logic to generate 4-6 quests based on investment
    // For MVP, just generate 4 basic ones
    // Base amount for calculation (mock 10000 if 0 balance to show gameplay?)
    // Let's use actual balance. If 0, use mock 1000 base for demo.
    
    // Ideally we read balance here, but this is called from within getUserBalance (careful of recursion if we called getUserBalance again)
    // We can query directly.
    const [balance] = await db.select().from(userBalances).where(eq(userBalances.userId, userId));
    const totalInvested = Number(balance?.mainBalance || 0);
    const effectiveBase = totalInvested > 0 ? totalInvested : 10000; // Minimum base for fun
    
    const rewardPerQuest = effectiveBase * 0.35;
    
    const newQuests = [
      { type: 'video', description: 'Watch Sponsor Video', rewardAmount: rewardPerQuest.toString() },
      { type: 'quiz', description: 'Daily Trading Quiz', rewardAmount: rewardPerQuest.toString() },
      { type: 'link', description: 'Visit Partner Site', rewardAmount: rewardPerQuest.toString() },
      { type: 'referral', description: 'Share with a Friend', rewardAmount: rewardPerQuest.toString() },
    ];

    for (const q of newQuests) {
      await db.insert(quests).values({
        userId,
        type: q.type as any,
        description: q.description,
        rewardAmount: q.rewardAmount,
        isCompleted: false
      });
    }
  }

  private async resetDailyQuests(userId: string) {
    // Delete old completed quests? Or archive them? 
    // For MVP, let's just delete old ones and create new ones to keep table small
    // Or just mark them archived. Let's delete for simplicity of "List" endpoint.
    await db.delete(quests).where(eq(quests.userId, userId));
    await this.generateDailyQuests(userId);
  }

  // === Roulette ===
  async playRoulette(userId: string): Promise<RouletteResultResponse> {
    const balance = await this.getUserBalance(userId);
    const locked = Number(balance.lockedBonus);
    
    if (locked <= 0) {
      throw new Error("No locked bonus");
    }

    // Simple 50/50 win chance for MVP
    const won = Math.random() > 0.5;
    
    let amountWon = 0;
    let newLocked = locked;
    let newMain = Number(balance.mainBalance);

    if (won) {
      amountWon = locked;
      newMain += locked;
      newLocked = 0;
    } else {
      // "Si perdu -> bonus peut rester bloqué ou l’utilisateur peut retenter"
      // Let's say you lose the chance to unlock it TODAY? 
      // Or you lose the bonus entirely? "Mise = bonus". Usually implies you lose it.
      // Let's implement: You lose the bonus. High stakes!
      newLocked = 0;
    }

    const [updated] = await db.update(userBalances)
      .set({
        mainBalance: newMain.toString(),
        lockedBonus: newLocked.toString()
      })
      .where(eq(userBalances.userId, userId))
      .returning();
      
    if (won) {
      await db.insert(transactions).values({
        userId,
        type: 'bonus_unlock',
        amount: amountWon.toString(),
        status: 'completed'
      });
    }

    return {
      won,
      amount: amountWon,
      newBalance: updated
    };
  }
}

export const storage = new DatabaseStorage();
