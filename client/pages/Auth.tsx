import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye as EyeIcon } from "lucide-react";
import { Chrome } from "lucide-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Supabase auth integration will go here
    // For now, redirect to proxy
    setTimeout(() => {
      window.location.href = "/proxy";
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-accent to-secondary flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">Eraser Proxy</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Anonymous browsing made easy
          </h1>
          <p className="text-lg text-white/90 max-w-md">
            Fast, secure, and reliable web proxy with bookmarks, multiple tabs, and full browser features.
          </p>
        </div>

        <div className="relative z-10">
          <div className="space-y-4">
            <div className="flex gap-3 text-white/90">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              <span>Lightning-fast performance</span>
            </div>
            <div className="flex gap-3 text-white/90">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              <span>Bank-level encryption</span>
            </div>
            <div className="flex gap-3 text-white/90">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
              <span>Save bookmarks across devices</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Join thousands using Eraser Proxy"
                : "Sign in to access your bookmarks"}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 h-10 font-medium"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* OAuth Options */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-10 font-medium gap-2 mb-4"
            disabled={loading}
          >
            <Chrome className="w-4 h-4" />
            Google
          </Button>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-semibold"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
