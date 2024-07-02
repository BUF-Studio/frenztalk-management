"use client";

import { useState } from "react";
import { deleteUserFromAuth, signUpWithEmail } from "@/lib/firebase/service/auth";
import { addUserToFirestore } from "@/lib/firebase/service/firestore";
import { useRouter } from "next/navigation";
import styles from "../../styles/Sign-up.module.scss";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await signUpWithEmail(email, password);
      try {
        await addUserToFirestore(user.uid, name, email);
        console.log(`Sucess sign up ${JSON.stringify(user)}`);
        router.push("/auth/sign-in");
      } catch (error) {
        console.error("Error adding user to Firestore:", error);
        // If adding user to Firestore fails, delete the created user
        await deleteUserFromAuth(user);
        console.log("User deleted from authentication due to Firestore error");
      }
    } catch (err) {
      console.log("Error sign up", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/auth/sign-in");
  }

  return (
    <div className={styles.formSectionContainer}>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Join FrenzTalk today</h1>
          <p className={styles.subtitle}>It&apos;s quick and easy</p>
        </div>
        <div className={styles.inputContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className={styles.input}
              required
            />
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
              placeholder="New Password"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.primaryButton}>
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
          <p className={styles.terms}>
            By clicking continue, you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a> including{" "}
            <a href="/cookies">Cookies Use</a>.
          </p>
        </div>
        <div className={styles.signInContainer}>
          <h4 className={styles.signInText}>Already have an account?</h4>
          <button
            type="submit"
            className={styles.signInButton}
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
