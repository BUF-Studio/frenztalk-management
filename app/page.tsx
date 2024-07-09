"use client";

import { useUser } from '@/lib/context/collection/userContext';
import { CounterProvider, useCounter } from '@/lib/context/counterContext';
import { AppProps } from 'next/app';
import type React from 'react';

const HomePage: React.FC = () => {

  const { user } = useUser();

  return (
    <main>
      <h1>Home Page</h1>
      {user && <div> {user.name}</div>}
      
    </main>
  );
};

export default HomePage;