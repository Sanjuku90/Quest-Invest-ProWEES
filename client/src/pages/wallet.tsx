import { AppLayout } from "@/components/layout/app-layout";
import { GlassCard } from "@/components/ui/card-stack";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTransactions, useDeposit, useWithdraw } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Schema for forms
const amountSchema = z.object({
  amount: z.string().transform((val) => Number(val)).pipe(z.number().positive().min(1)),
});

type AmountForm = z.infer<typeof amountSchema>;

export default function Wallet() {
  const { data: dashboard } = useDashboard();
  const { data: transactions, isLoading: isLoadingHistory } = useTransactions();
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-display font-bold">My Wallet</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Balance Card */}
          <GlassCard className="lg:col-span-2 p-8" gradient>
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-muted-foreground font-medium mb-2">Total Balance</p>
                <h2 className="text-5xl font-display font-bold text-white mb-8">
                  ${dashboard?.balance.mainBalance || "0.00"}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <TransactionDialog type="deposit" />
                  <TransactionDialog type="withdraw" maxAmount={Number(dashboard?.balance.mainBalance)} />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Secondary Stats */}
          <div className="space-y-4">
            <GlassCard className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Locked Bonus</p>
              <p className="text-2xl font-bold text-white">${dashboard?.balance.lockedBonus || "0.00"}</p>
            </GlassCard>
            <GlassCard className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Quest Earnings</p>
              <p className="text-2xl font-bold text-accent">${dashboard?.balance.questEarnings || "0.00"}</p>
            </GlassCard>
            <GlassCard className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Investment Tier</p>
              <p className="text-2xl font-bold text-primary">Level {dashboard?.balance.investmentTier || 0}</p>
            </GlassCard>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-xl font-bold">Transaction History</h3>
          </div>

          <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-muted-foreground font-medium border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoadingHistory ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center">Loading...</td></tr>
                  ) : transactions?.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No transactions yet</td></tr>
                  ) : (
                    transactions?.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 capitalize font-medium">
                          <span className={cn(
                            "inline-flex items-center gap-2",
                            tx.type === 'deposit' || tx.type === 'bonus_unlock' || tx.type === 'quest_reward' ? 'text-green-400' : 'text-white'
                          )}>
                            {tx.type === 'deposit' && <ArrowDownLeft className="w-4 h-4" />}
                            {tx.type === 'withdrawal' && <ArrowUpRight className="w-4 h-4" />}
                            {tx.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium bg-white/10",
                            tx.status === 'completed' ? "bg-green-500/20 text-green-400" : 
                            tx.status === 'pending' ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          )}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">
                          {format(new Date(tx.createdAt || new Date()), "MMM d, yyyy")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}

function TransactionDialog({ type, maxAmount }: { type: 'deposit' | 'withdraw', maxAmount?: number }) {
  const [open, setOpen] = useState(false);
  const { mutate: deposit, isPending: isDepositPending } = useDeposit();
  const { mutate: withdraw, isPending: isWithdrawPending } = useWithdraw();
  
  const isPending = isDepositPending || isWithdrawPending;
  const isDeposit = type === 'deposit';

  const form = useForm<AmountForm>({
    resolver: zodResolver(amountSchema),
    defaultValues: { amount: 0 },
  });

  const onSubmit = (data: AmountForm) => {
    const fn = isDeposit ? deposit : withdraw;
    fn({ amount: data.amount }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isDeposit ? "default" : "outline"}
          className={cn(
            "w-full h-12 rounded-xl font-semibold",
            isDeposit ? "bg-primary text-white hover:bg-primary/90" : "border-white/20 hover:bg-white/10"
          )}
        >
          {isDeposit ? "Deposit" : "Withdraw"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-white/10 text-white sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isDeposit ? "Deposit Funds" : "Withdraw Funds"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      placeholder="0.00" 
                      className="bg-background/50 border-white/10 h-12 text-lg" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === 'withdraw' && maxAmount !== undefined && (
              <p className="text-xs text-muted-foreground">Available: ${maxAmount}</p>
            )}
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90"
              disabled={isPending}
            >
              {isPending ? "Processing..." : `Confirm ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
