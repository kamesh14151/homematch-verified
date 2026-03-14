import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import loginHero from "@/assets/login-hero.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
    toast({ title: "Email sent", description: "Check your inbox for the reset link." });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex w-full flex-col justify-between px-6 py-4 sm:px-8 lg:w-1/2 lg:px-12 lg:py-5">
        <Link to="/" className="inline-flex items-center gap-2 self-start">
          <BrandWordmark compact />
        </Link>

        <div className="mx-auto w-full max-w-[350px]">
          <Link to="/login" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-[28px]">Reset your password</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {sent
              ? "We've sent a password reset link to your email. Check your inbox and follow the instructions."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>

          {!sent && (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-xl border-border bg-muted/50 pl-10 text-foreground placeholder:text-muted-foreground/60"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="h-10 w-full rounded-xl text-sm font-semibold" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          {sent && (
            <Button asChild className="mt-5 h-10 w-full rounded-xl text-sm font-semibold" variant="outline">
              <Link to="/login">Return to Login</Link>
            </Button>
          )}
        </div>

        <div />
      </div>

      <div className="relative hidden overflow-hidden rounded-l-3xl lg:block lg:w-1/2">
        <img src={loginHero} alt="Property" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    </div>
  );
}
