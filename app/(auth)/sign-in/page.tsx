"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/service/auth";
import { getErrorMessage } from "@/utils/get-error-message";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
    // <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white px-8 py-4 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col mb-6 gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Sign In
          </h1>
          <p className="text-md text-gray-600">
            Sign In with Frenztalk Account
          </p>
        </div>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            required
          />
          <Button
            type="submit"
            variant="default"
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </form>
        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300 flex items-center justify-center"
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
        </button>
        <p className="mt-4 text-xs text-center text-gray-600">
          By clicking continue, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>{" "}
          including{" "}
          <Link href="/cookies" className="text-blue-600 hover:underline">
            Cookies Use
          </Link>
          .
        </p>
        <div className="mt-8 text-center">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Don&apos;t have an account?
          </h4>
          <button
            type="button"
            onClick={() => router.push("/sign-up")}
            className="w-full border border-gray-300 text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    // </div>
  );
}
