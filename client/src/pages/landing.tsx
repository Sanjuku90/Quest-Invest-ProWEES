import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronRight, BarChart3, ShieldCheck, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function Landing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      {/* Nav */}
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 font-display text-xl font-bold">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
            Q
          </div>
          <span className="text-gradient">QuestInvest</span>
        </div>
        <a href="/api/login">
          <Button variant="outline" className="border-white/20 hover:bg-white/10 rounded-full px-6">
            Log In
          </Button>
        </a>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">New Era of Investing</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8">
            Invest. Play. <br />
            <span className="text-gradient">Win Big.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Gamify your financial journey. Complete daily quests, spin for bonuses, and watch your portfolio grow with guaranteed rewards.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/api/login" className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full">
                Se connecter <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="ghost" className="rounded-full h-14 px-8 text-lg font-medium text-muted-foreground hover:text-white hover:bg-white/5 w-full">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card/30 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <Feature 
              icon={Trophy}
              title="Daily Quests"
              description="Complete simple tasks every day to earn guaranteed cash rewards added directly to your portfolio."
            />
            <Feature 
              icon={BarChart3}
              title="Smart Growth"
              description="Watch your investment tier rise as you deposit more, unlocking higher quest rewards and better perks."
            />
            <Feature 
              icon={ShieldCheck}
              title="Secure Platform"
              description="Your funds are safe with enterprise-grade security and instant withdrawals whenever you want."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">Prêt à passer au niveau supérieur ?</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Rejoignez des milliers d'investisseurs qui redécouvrent la finance. Aucune carte de crédit requise pour commencer.
          </p>
          <Link href="/signup">
            <Button size="lg" className="rounded-full h-14 px-10 text-lg font-semibold bg-gradient-to-r from-primary to-accent border-0 hover:opacity-90">
              Créer un compte gratuit <ChevronRight className="ml-1 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© 2024 QuestInvest Pro. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, description }: any) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors duration-300">
      <div className="p-4 rounded-xl bg-primary/10 text-primary mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
