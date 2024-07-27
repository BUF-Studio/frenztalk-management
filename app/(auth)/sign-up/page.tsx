"use client";

import { type ChangeEvent, useState, useRef } from "react";
import {
  deleteUserFromAuth,
  signUpWithEmail,
} from "@/lib/firebase/service/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { addUserToFirestore } from "@/lib/firebase/service/firestore";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth/sign-up/Sign-up.module.scss";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { getErrorMessage } from "@/utils/get-error-message";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const passwordInputRef = useRef<HTMLDivElement>(null);

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

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
    // Set a timeout to move the cursor to the end after the input re-renders
    setTimeout(() => {
      if (passwordInputRef.current) {
        const input = passwordInputRef.current.querySelector("input");
        if (input) {
          const length = input.value.length;
          input.setSelectionRange(length, length);
          input.focus();
        }
      }
    }, 0);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className={styles.formSectionContainer}>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Join FrenzTalk today</h1>
          <p className={styles.subtitle}>It&apos;s quick and easy</p>
        </div>
        <div className={styles.inputContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className={styles.input}
              required
            /> */}
            <TextField
              id="name"
              label="Username"
              name="name"
              variant="outlined"
              placeholder="Johnny Depp"
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <TextField
              id="email"
              label="Email"
              name="email"
              variant="outlined"
              placeholder="johnny@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <FormControl
              className={styles.input}
              variant="outlined"
              fullWidth
              margin="normal"
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                ref={passwordInputRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            {/* <input
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
            /> */}
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
      </div>
    </div>
  );
};

export default SignUp;
