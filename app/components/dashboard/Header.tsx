import type React from 'react';
import styles from '../../styles/components/dashboard/Header.module.scss';

interface HeaderProps {
  currentLocation: string;
}

const Header: React.FC<HeaderProps> = ({ currentLocation }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{currentLocation}</h1>
    </div>
  );
}

export default Header;
