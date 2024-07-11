import type React from "react";
import styles from "@/styles/components/dashboard/Badge.module.scss";

type BadgeProps = {
  status: string;
};

const Badge: React.FC<BadgeProps> = ({ status }) => {
  return status == null ? (
    <p>-</p>
  ) : (
    <span className={`${styles.badge} ${styles[status?.toLowerCase()]}`}>
      {status}
    </span>
  );
};

export default Badge;
