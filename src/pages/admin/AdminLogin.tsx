// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  SignedIn,
  SignedOut,
  UserButton,        // ← ADD THIS
  useUser,
  useAuth,
  useClerk,
} from "@clerk/clerk-react";

const ADMIN_PASSCODE = "emperor2025"; // Change anytime!

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [passcodeVerified, setPasscodeVerified] = useState(false);

  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useAuth();           // ← proper way
  const { isLoaded, user } = useUser();       // ← proper way

  const handlePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setPasscodeVerified(true);
      sessionStorage.setItem("admin-passcode-ok", "true");
      toast.success("Passcode verified! Please sign in.");
    } else {
      toast.error("Wrong passcode. Access denied.");
      setPasscode("");
    }
  };

  // ──────────────────────────────────────────────────────────────
  // AUTOMATIC REDIRECT when the user is signed in AND passcode is OK
  // ──────────────────────────────────────────────────────────────
  if (passcodeVerified && isLoaded && isSignedIn) {
    // Mark as admin (you already check this in Dashboard)
    localStorage.setItem("admin-auth", "true");

    // Use replace so the login page is removed from history
    navigate("/admin/dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-4xl font-bold">I</span>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            IPD-Emporium
          </CardTitle>
          <p className="text-muted-foreground mt-2 text-lg">Admin Portal</p>
        </CardHeader>

        <CardContent className="space-y-8">
          {!passcodeVerified ? (
            <form onSubmit={handlePasscode} className="space-y-6">
              <div className="text-center">
 elér                <p className="text-sm text-muted-foreground mb-8">
                  Enter the secret admin passcode to continue
                </p>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="h-14 text-center text-2xl tracking-widest font-mono"
                autoFocus
              />
              <Button type="submit" size="lg" className="w-full h-14 text-lg font-medium">
                Verify Passcode
              </Button>
            </form>
          ) : (
            <>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Access Granted</h3>
                <p className="text-muted-foreground mt-2">
                  Now sign in to enter the admin dashboard
                </p>
              </div>

              {/* Signed out → show Sign-in button */}
              <SignedOut>
                <Button
                  onClick={() =>
                    openSignIn({
                      // Clerk will redirect here automatically after sign-in
                      afterSignInUrl: "/admin/dashboard",
                    })
                  }
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
                >
                  Sign In as Admin
                </Button>
              </SignedOut>

              {/* Already signed in → show user button + redirect message */}
              <SignedIn>
                <div className="text-center space-y-6">
                  <UserButton afterSignOutUrl="/" />
                  <div>
                    <p className="text-lg font-medium text-foreground">Welcome back!</p>
                    <p className="text-sm text-muted-foreground">
                      Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              </SignedIn>
            </>
          )}

          <div className="text-center text-xs text-muted-foreground pt-6 border-t border-gray-200">
            <p>This portal is hidden. Only the Emperor may enter.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}