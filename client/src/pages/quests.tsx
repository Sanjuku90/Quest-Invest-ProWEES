import { AppLayout } from "@/components/layout/app-layout";
import { useQuests } from "@/hooks/use-quests";
import { QuestCard } from "@/components/quests/quest-card";
import { Target } from "lucide-react";

export default function Quests() {
  const { data: quests, isLoading } = useQuests();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Target className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold">Daily Quests</h1>
          </div>
          <p className="text-muted-foreground ml-14">
            Complete tasks to earn real rewards. Resets daily at midnight.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests?.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
            {quests?.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No quests available right now. Check back later!
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
