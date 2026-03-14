import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import loginHero from "@/assets/login-hero.jpg";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a recovery session
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setValidSession(true);
    }
    // Also check via auth state
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: "Too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({
        title: "Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setSuccess(true);
    toast({
      title: "Password updated",
      description: "You can now sign in with your new password.",
    });
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex w-full flex-col justify-between px-6 py-4 sm:px-8 lg:w-1/2 lg:px-12 lg:py-5">
        <Link to="/" className="inline-flex items-center gap-2 self-start">
          <BrandWordmark compact />
        </Link>

        <div className="mx-auto w-full max-w-[350px]">
          {success ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h1 className="mt-4 text-2xl font-bold">Password Updated</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Redirecting you to login...
              </p>
            </div>
          ) : !validSession ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Invalid or Expired Link</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This reset link may have expired. Please request a new one.
              </p>
              <Button asChild className="mt-4 rounded-xl" variant="outline">
                <Link to="/forgot-password">Request New Link</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-[28px]">
                Set new password
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 rounded-xl border-border bg-muted/50 pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="h-10 rounded-xl border-border bg-muted/50 pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="h-10 w-full rounded-xl text-sm font-semibold"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </>
          )}
        </div>

        <div />
      </div>

      <div className="relative hidden overflow-hidden rounded-l-3xl lg:block lg:w-1/2">
        <img
          src={loginHero}
          alt="Property"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    </div>
  );
}
