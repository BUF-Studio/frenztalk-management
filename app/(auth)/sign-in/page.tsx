"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/service/auth";
import { getErrorMessage } from "@/utils/get-error-message";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      showSnackbar("Signed in successfully", "success");
      router.push("/tuitions");
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
      console.error("Error signing in with email and password:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log("Signed in with Google successfully");
      showSnackbar("Signed in successfully", "success");
      router.push("/tuitions");
    } catch (err) {
      console.error("Error signing in with Google:", err);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between min-h-full">
      <div className="flex flex-col justify-start flex-grow md:justify-center">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="scroll-m-20 text-3xl font-medium tracking-tight lg:text-4xl">
              Sign In
            </h1>
            <p className="leading-7">to continue journey with FrenzTalk</p>
          </div>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              type="submit"
              variant="default"
              className="flex w-full"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </form>
          <div>
            <div className="relative flex py-4 items-center">
              <Separator className="flex-1" />
              <span className="flex-shrink mx-4 text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="flex w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <title>Google Logo</title>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Sign in with Google
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="text-sm text-primary hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-sm text-primary hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            including{" "}
            <Link
              href="/cookies"
              className="text-sm text-primary hover:underline"
            >
              Cookies Use
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="text-center">
        <Link href="/sign-up">
          <Button variant="link" className="text-sm md:text-base">
            Don&apos;t have an account? Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
