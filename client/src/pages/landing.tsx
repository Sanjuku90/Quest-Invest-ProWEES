import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Trophy, 
  BarChart3,
  Globe,
  Coins
} from "lucide-react";
import stockImage from '@assets/stock_images/professional_financi_43003c69.jpg';

export default function Landing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              QuestInvest
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-slate-400 hover:text-white"
              onClick={() => setLocation("/login")}
            >
              Connexion
            </Button>
            <Button 
              className="bg-white text-black hover:bg-slate-200 rounded-full px-6"
              onClick={() => setLocation("/signup")}
            >
              Démarrer
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
              Plateforme Nouvelle Génération
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              Investissez par le <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
                Jeu et la Quête
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
              Transformez votre capital en aventure. Participez à des quêtes quotidiennes, 
              débloquez des bonus exclusifs et boostez vos rendements financiers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-slate-200 rounded-full px-8 h-14 text-lg font-semibold group"
                onClick={() => setLocation("/signup")}
              >
                Commencer l'aventure
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/10 hover:bg-white/5 rounded-full px-8 h-14 text-lg backdrop-blur-sm"
                onClick={() => setLocation("/login")}
              >
                Voir le Dashboard
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8 border-t border-white/5">
              <div>
                <div className="text-2xl font-bold">12K+</div>
                <div className="text-sm text-slate-500">Investisseurs active</div>
              </div>
              <div>
                <div className="text-2xl font-bold">€4.5M</div>
                <div className="text-sm text-slate-500">Volume transigé</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-slate-500">Disponibilité</div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={stockImage} 
                alt="Dashboard Preview" 
                className="w-full object-cover aspect-[4/3] opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Performance Hebdomadaire</div>
                      <div className="text-xs text-slate-500">+12.4% ce mois</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">+€1,240.00</div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[75%] h-full bg-gradient-to-r from-blue-500 to-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold">Pourquoi QuestInvest Pro ?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Une infrastructure robuste combinée à une expérience utilisateur ludique pour maximiser votre potentiel.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Sécurité Maximale",
                description: "Vos fonds sont protégés par des protocoles de chiffrement de grade bancaire et un stockage à froid.",
                color: "blue"
              },
              {
                icon: Trophy,
                title: "Système de Quêtes",
                description: "Gagnez des récompenses réelles en complétant des objectifs d'investissement et d'apprentissage.",
                color: "purple"
              },
              {
                icon: Zap,
                title: "Exécution Instantanée",
                description: "Profitez d'une latence minimale pour toutes vos transactions et retraits de gains.",
                color: "yellow"
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale">
          <div className="flex items-center gap-2"><Globe className="w-6 h-6" /> <span className="font-bold">GLOBAL VENTURES</span></div>
          <div className="flex items-center gap-2"><Coins className="w-6 h-6" /> <span className="font-bold">CRYPTO CAPITAL</span></div>
          <div className="flex items-center gap-2"><TrendingUp className="w-6 h-6" /> <span className="font-bold">TECH INVEST</span></div>
          <div className="flex items-center gap-2 text-2xl font-black italic">FIN-TECH</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-600/10 blur-[150px] -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl lg:text-6xl font-bold">Prêt à transformer votre <br /> futur financier ?</h2>
          <p className="text-xl text-slate-400">
            Rejoignez des milliers d'investisseurs qui ont déjà sauté le pas. <br />
            Inscription gratuite et sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-slate-200 rounded-full px-12 h-16 text-xl font-bold"
              onClick={() => setLocation("/signup")}
            >
              Créer mon compte
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-blue-500" />
            <span className="font-bold">QuestInvest Pro</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Aide & Support</a>
          </div>
          <div className="text-sm text-slate-600">
            © 2025 QuestInvest Pro. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
