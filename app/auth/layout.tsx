import Image from "next/image";
import styles from "../styles/Auth.module.scss";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.logoSection}>
        <Image
          src="/frenztalk-logo.jpg"
          alt="Frenztalk Logo"
          priority
          width={200}
          height={200}
        />
      </div>
      <div className={styles.formSection}>
        <div className={styles.formSectionContainer}>
            {children}
        </div>
      </div>
    </div>
  );
}
