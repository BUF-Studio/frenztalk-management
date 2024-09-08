"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signUpWithEmail,
  deleteUserFromAuth,
} from "@/lib/firebase/service/auth";
import { addUserToFirestore } from "@/lib/firebase/service/firestore";
import { getErrorMessage } from "@/utils/get-error-message";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signUpWithEmail(email, password);
      try {
        await addUserToFirestore(user.uid, name, email);
        showSnackbar("Signed up successfully", "success");
        router.push("/sign-in");
      } catch (error) {
        showSnackbar(getErrorMessage(error), "error");
        await deleteUserFromAuth(user);
        console.log("User deleted from authentication due to Firestore error");
      }
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between min-h-full">
      <div className="flex flex-col justify-start flex-grow md:justify-center">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="scroll-m-20 text-3xl font-medium tracking-tight lg:text-4xl">
              Join FrenzTalk today
            </h1>
            <p className="leading-7">It&apos;s quick and easy</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              required
            />
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
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
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
        <Button
          variant="link"
          className="text-sm md:text-base"
          onClick={() => router.push("/sign-in")}
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}
