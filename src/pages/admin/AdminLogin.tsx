// src/pages/admin/AdminLogin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-react";

const ADMIN_PASSCODE = "emperor2025";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { openSignIn, signOut } = useClerk();

  // Check if already verified this session
  useEffect(() => {
    if (sessionStorage.getItem("admin-passcode-ok") === "true") {
      setVerified(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem("admin-passcode-ok", "true");
      setVerified(true);
      toast.success("Passcode correct! Now sign in.");
    } else {
      toast.error("Wrong passcode!");
      setPasscode("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border border-purple-500/20 bg-black/50 backdrop-blur">
        <CardHeader className="text-center pb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white text-5xl font-bold">I</span>
          </div>
          <CardTitle className="text-4xl font-bold text-white">
            IPD-Emporium
          </CardTitle>
          <p className="text-purple-300 text-lg mt-2">Imperial Admin Portal</p>
        </CardHeader>

        <CardContent className="space-y-8">
          {!verified ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-center text-gray-300">
                Enter the Emperor's passcode
              </p>
              <Input
                type="password"
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="h-16 text-center text-3xl tracking-widest font-mono bg-white/10 border-purple-500/50 text-white placeholder:text-gray-500"
                autoFocus
              />
              <Button type="submit" size="lg" className="w-full h-16 text-lg bg-purple-600 hover:bg-purple-700">
                Enter the Empire
              </Button>
            </form>
          ) : (
            <>
              <div className="text-center py-8 text-white">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">Check</span>
                </div>
                <h3 className="text-2xl font-bold">Access Granted</h3>
                <p className="text-gray-300 mt-2">Sign in to rule</p>
              </div>

              <SignedOut>
                <Button
                  onClick={() =>
                    openSignIn({
                      redirectUrl: "/admin/dashboard", // ← THIS WORKS IN PRODUCTION
                    })
                  }
                  size="lg"
                  className="w-full h-16 text-lg bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Sign In as Emperor
                </Button>
              </SignedOut>

              <SignedIn>
                <div className="text-center space-y-6">
                  <p className="text-green-400 text-xl">Welcome, Emperor</p>
                  <Button
                    onClick={() => {
                      localStorage.setItem("admin-auth", "true");
                      navigate("/admin/dashboard", { replace: true });
                    }}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Enter Dashboard
                  </Button>
                </div>
              </SignedIn>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}