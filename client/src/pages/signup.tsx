import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronRight, BarChart3, ShieldCheck, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function Signup() {
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
        <Link href="/login">
          <Button variant="ghost" className="text-muted-foreground hover:text-white rounded-full px-6">
            Déjà un compte ? Connexion
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-8">
            Rejoignez <br />
            <span className="text-gradient">L'Aventure.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Créez votre compte QuestInvest Pro en un clic avec Replit Auth et commencez à gagner des récompenses dès aujourd'hui.
          </p>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-6">Prêt à commencer ?</h3>
            <p className="text-muted-foreground mb-8">
              L'inscription est instantanée et sécurisée via Replit Auth.
            </p>
            <a href="/api/login" className="block w-full">
              <Button size="lg" className="w-full rounded-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent border-0 hover:opacity-90 shadow-[0_0_30px_rgba(147,51,234,0.3)]">
                S'inscrire avec Replit Auth <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <p className="mt-6 text-xs text-muted-foreground">
              En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© 2024 QuestInvest Pro. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
