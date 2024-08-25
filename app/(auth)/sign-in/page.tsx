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
  const { signInWithEmail, signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  if (user) {
    router.push("/");
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmail(email, password);
      showSnackbar("Signed in successfully", "success");
      router.push("/tuitions");
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
      console.error("Error signing in with email and password:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log("Signed in with Google successfully");
      router.push("/tuitions");
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

// <div className="-ml-2.5 -mt-3">
//   <div className="inline-flex items-center">
//     <label
//       className="relative flex items-center p-3 rounded-full cursor-pointer"
//       htmlFor="remember"
//     >
//       <input
//         type="checkbox"
//         className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
//         id="remember"
//         checked={rememberMe}
//         onChange={(e) => setRememberMe(e.target.checked)}
//       />
//       <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
//         {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-3.5 w-3.5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//           stroke="currentColor"
//           strokeWidth="1"
//         >
//           <path
//             fillRule="evenodd"
//             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </span>
//     </label>
//     <label
//       className="mt-px font-light text-gray-700 cursor-pointer select-none"
//       htmlFor="remember"
//     >
//       Remember Me
//     </label>
//   </div>
// </div>;

// <p className="flex justify-center mt-4 font-sans text-sm font-light leading-normal text-inherit">
//   Don&apos;t have an account?
//   <Link
//     href="/signup"
//     className="block ml-1 font-sans text-sm font-bold leading-normal text-blue-gray-900"
//   >
//     Sign up
//   </Link>
// </p>;
