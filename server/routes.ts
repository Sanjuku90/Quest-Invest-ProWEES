import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { userBalances } from "@shared/schema"; // Imported for types if needed, but storage handles logic

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // === API ROUTES ===

  // Dashboard
  app.get(api.dashboard.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;

    const balance = await storage.getUserBalance(userId);
    const quests = await storage.getUserQuests(userId);
    
    // Calculate stats
    const completedQuestsCount = quests.filter(q => q.isCompleted).length;
    const totalQuestsCount = quests.length;
    
    // Determine next reset (e.g., midnight UTC)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    res.json({
      balance,
      completedQuestsCount,
      totalQuestsCount,
      nextResetTime: tomorrow.toISOString(),
    });
  });

  // Quests
  app.get(api.quests.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const quests = await storage.getUserQuests(userId);
    res.json(quests);
  });

  app.post(api.quests.complete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const questId = Number(req.params.id);

    try {
      const updatedQuest = await storage.completeQuest(userId, questId);
      res.json(updatedQuest);
    } catch (error: any) {
      if (error.message === "Quest not found") return res.status(404).json({ message: "Quest not found" });
      if (error.message === "Quest already completed") return res.status(400).json({ message: "Quest already completed" });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Roulette
  app.post(api.roulette.play.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;

    try {
      const result = await storage.playRoulette(userId);
      res.json(result);
    } catch (error: any) {
      if (error.message === "No locked bonus") return res.status(400).json({ message: "No locked bonus to bet" });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Wallet
  app.post(api.wallet.deposit.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    
    try {
      const input = api.wallet.deposit.input.parse(req.body);
      const balance = await storage.deposit(userId, input.amount);
      res.json(balance);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.wallet.withdraw.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;

    try {
      const input = api.wallet.withdraw.input.parse(req.body);
      const balance = await storage.withdraw(userId, input.amount);
      res.json(balance);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      if (err.message === "Insufficient funds") {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.wallet.history.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const history = await storage.getTransactionHistory(userId);
    res.json(history);
  });

  return httpServer;
}

// Seed function for new users or daily reset logic would go here
// For MVP, we'll initialize balances/quests in storage.getUserBalance lazily if not exists
