import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Lock, Eye, Globe, BookmarkPlus } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Eraser Proxy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/proxy">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Launch App</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium text-primary">Lightning-Fast Web Proxy</p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
            Browse Anything,<br />
            <span className="gradient-primary bg-clip-text text-transparent">
              Privately & Instantly
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The fastest, safest web proxy. Access any website with our optimized infrastructure. 
            Multiple tabs, full browser features, bookmarks, and accounts all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/proxy">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                Start Browsing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              Learn More <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">Everything you need for fast, secure browsing</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass p-8 rounded-xl border border-white/20 hover:border-primary/50 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4 font-bold text-lg text-primary">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-1 bg-gradient-to-r from-primary to-transparent" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="glass p-12 rounded-2xl border border-white/20 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience the Fastest Proxy?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create an account to save bookmarks, sync across devices, and unlock advanced features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/proxy">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Launch Proxy
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-card mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">Eraser Proxy</span>
              </div>
              <p className="text-sm text-muted-foreground">The fastest, safest web proxy on the internet.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Proxy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Status</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">System Status</a></li>
                <li><a href="#" className="hover:text-foreground transition">Uptime</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 Eraser Proxy. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition">Twitter</a>
              <a href="#" className="hover:text-foreground transition">GitHub</a>
              <a href="#" className="hover:text-foreground transition">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Lightning Fast",
    description: "Optimized infrastructure delivers blazing-fast load times, even for large websites.",
    icon: <Zap className="w-6 h-6 text-white" />,
  },
  {
    title: "Completely Safe",
    description: "Military-grade encryption keeps your browsing secure and your data private.",
    icon: <Shield className="w-6 h-6 text-white" />,
  },
  {
    title: "Bank-Level Security",
    description: "Enterprise-grade security protocols protect against threats and malware.",
    icon: <Lock className="w-6 h-6 text-white" />,
  },
  {
    title: "Multiple Tabs",
    description: "Browse multiple sites simultaneously with our advanced tab management system.",
    icon: <Globe className="w-6 h-6 text-white" />,
  },
  {
    title: "Save Bookmarks",
    description: "Create an account to save and organize your favorite websites across devices.",
    icon: <BookmarkPlus className="w-6 h-6 text-white" />,
  },
  {
    title: "Full Browser Features",
    description: "Back/forward buttons, URL editing, fullscreen mode, and everything you expect.",
    icon: <Eye className="w-6 h-6 text-white" />,
  },
];

const steps = [
  {
    number: "1",
    title: "Enter URL",
    description: "Type any website URL into the search bar",
  },
  {
    number: "2",
    title: "Instant Load",
    description: "Our proxy fetches and displays the site instantly",
  },
  {
    number: "3",
    title: "Browse Freely",
    description: "Use back, forward, and all browser features",
  },
  {
    number: "4",
    title: "Bookmark & Sync",
    description: "Save favorites to your account for later",
  },
];
