"use client";

import { useState } from "react";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/service/auth";
import { useRouter } from "next/navigation";
import styles from "../../styles/Sign-in.module.scss";
import GoogleSignInButton from "@/components/googleSignInButton";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmail(email, password);
      console.log("Signed in successfully");
      sessionStorage.setItem("user", "true"); // Ensure user session is set
      router.push("/");
    } catch (error) {
      console.error("Error signing in with email and password:", error);
      setError("Failed to sign in. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log("Signed in with Google successfully");
      sessionStorage.setItem("user", "true");
      router.push("/");
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleSignUp = () => {
    router.push("/auth/sign-up");
  };

  return (
    <div className={styles.formSectionContainer}>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Sign in to FrenzTalk</h1>
          <p className={styles.subtitle}>Sign in using FrenzTalk account</p>
        </div>
        <div className={styles.inputContainer}>
          <form className={styles.form} onSubmit={handleEmailLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={styles.input}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.primaryButton}>
              Sign In
            </button>
          </form>
          <div className={styles.separator}>
            <p className={styles.orContinue}>
              <span>or</span>
            </p>
          </div>
          <GoogleSignInButton onClick={handleGoogleLogin} />
          <p className={styles.terms}>
            By clicking continue, you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a> including{" "}
            <a href="/cookies">Cookies Use</a>.
          </p>
        </div>
        <div className={styles.signUpContainer}>
          <h4 className={styles.signUpText}>Dont have an account?</h4>
          <button
            type="submit"
            className={styles.signUpButton}
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
