"use client";

import { CounterProvider, useCounter } from '@/lib/context/counterContext';
import { AppProps } from 'next/app';
import type React from 'react';

const HomePage: React.FC = () => {
  return (
    <main>
      <h1>Home Page</h1>
    </main>
  );
};

export default HomePage;