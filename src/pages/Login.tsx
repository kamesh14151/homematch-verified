import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({
        title: "Google sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[linear-gradient(180deg,#fffaf3_0%,#fffdf8_100%)]">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-primary/8 blur-3xl filter" />
        <div className="absolute -right-[10%] bottom-[10%] h-[50%] w-[50%] rounded-full bg-amber-100/60 blur-3xl filter" />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] lg:flex lg:h-[650px]">
        {/* Left Side - Trust Signals & Brand */}
        <div className="hidden flex-col justify-between bg-zinc-900 p-12 text-white lg:flex lg:w-5/12">
          <div>
            <Link to="/" className="inline-flex">
              <BrandWordmark theme="dark" />
            </Link>
            <div className="mt-16">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                Welcome back to your <br /> verified community.
              </h2>
              <p className="mt-4 text-base font-light text-zinc-400">
                Log in to securely manage your properties, sign agreements, and
                securely message verified tenants.
              </p>
            </div>
            <div className="mt-12 space-y-6">
              {[
                "End-to-end verified listings",
                "Secure tenant backgrounds",
                "Automated rent agreements",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-zinc-500">
            © {new Date().getFullYear()} RentVerify. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-7/12 lg:px-16 xl:px-24">
          <div className="mb-8 lg:hidden">
            <Link to="/">
              <BrandWordmark />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Log in
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group relative rounded-xl border border-border bg-white transition-all focus-within:border-zinc-800 focus-within:ring-1 focus-within:ring-zinc-800">
              <div className="absolute left-3 top-3 text-xs font-semibold text-muted-foreground transition-colors group-focus-within:text-zinc-800">
                Email
              </div>
              <input
                id="email"
                type="email"
                placeholder="Name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-3 pb-3 pt-7 text-sm text-foreground outline-none placeholder:text-transparent focus:placeholder:text-muted-foreground/50"
                required
              />
            </div>

            <div className="group relative rounded-xl border border-border bg-white transition-all focus-within:border-zinc-800 focus-within:ring-1 focus-within:ring-zinc-800">
              <div className="absolute left-3 top-3 text-xs font-semibold text-muted-foreground transition-colors group-focus-within:text-zinc-800">
                Password
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent pl-3 pr-10 pb-3 pt-7 text-sm text-foreground outline-none placeholder:text-transparent focus:placeholder:text-muted-foreground/50"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </form>

          <div className="my-6 flex items-center text-sm">
            <div className="h-px flex-1 bg-border" />
            <span className="px-4 text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-xl border-2 border-border bg-white font-semibold hover:bg-slate-50"
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-8 space-y-2 text-center text-sm">
            <p>
              <Link
                to="/forgot-password"
                className="font-medium text-foreground hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-foreground hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
