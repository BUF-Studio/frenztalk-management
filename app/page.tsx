"use client";

import { CounterProvider, useCounter } from '@/lib/context/counterContext';
import StudentsProvider from '@/lib/context/studentContext';
import { AppProps } from 'next/app';
import React from 'react';




const HomePage: React.FC = () => {
  return (
    // <StudentsProvider>
      <div>
        <h1>Next.js Page with Context Provider</h1>
        
      </div>
    // </StudentsProvider>
  );
};

export default HomePage;