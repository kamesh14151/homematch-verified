import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setSent(true);
    toast({
      title: "Email sent",
      description: "Check your inbox for the reset link.",
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">

      <div className="relative z-10 w-full max-w-[1000px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl lg:flex lg:h-[650px]">
        {/* Left Side */}
        <div className="hidden flex-col justify-between bg-zinc-950 p-12 text-white lg:flex lg:w-5/12">
          <div>
            <Link to="/" className="inline-flex">
              <BrandWordmark theme="dark" />
            </Link>
            <div className="mt-16">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                Secure your <br /> RentVerify account.
              </h2>
              <p className="mt-4 text-base font-light text-zinc-400">
                A verified account gives you access to top tier homes and safe
                document sharing. Don't lose access.
              </p>
            </div>
            <div className="mt-12 space-y-6">
              {[
                "Regain account access simply",
                "Password-less verification",
                "Advanced data protection",
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

        {/* Right Side */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-7/12 lg:px-16 xl:px-24">
          <div className="mb-8 lg:hidden">
            <Link to="/">
              <BrandWordmark />
            </Link>
          </div>

          <div className="mb-8">
            <Link
              to="/login"
              className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {sent
                ? "We've sent a password reset link to your email. Check your inbox and follow the instructions."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {!sent ? (
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

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          ) : (
            <Button
              className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={() => setSent(false)}
            >
              Try another email
            </Button>
          )}

          <div className="mt-8 text-center text-sm">
            <p className="text-muted-foreground">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-foreground hover:underline"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
