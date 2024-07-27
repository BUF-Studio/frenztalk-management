"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
// import { signInWithEmail, signInWithGoogle } from "auth";

import { useRouter } from "next/navigation";
import styles from "@/styles/auth/sign-in/Sign-in.module.scss";
import GoogleSignInButton from "@/app/components/sign-in/googleSignInButton";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { getErrorMessage } from "@/utils/get-error-message";

const SignIn = () => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmail(email, password);
      showSnackbar("Signed in successfully", "success");
      router.push("/");
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
      console.error("Error signing in with email and password:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log("Signed in with Google successfully");
      router.push("/");
    } catch (err) {
      console.error("Error signing in with Google:", err);
    }
  };

  const handleSignUp = () => {
    router.push("/sign-up");
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
      </div>
    </div>
  );
};

export default SignIn;
