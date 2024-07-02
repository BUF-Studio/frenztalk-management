"use client";

import { useState } from 'react';
import { signUpWithEmail } from '@/lib/firebase/auth';
import { addUserToFirestore } from '@/lib/firebase/firestore';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await signUpWithEmail(email, password);
      await addUserToFirestore(user.uid, name, email);
      console.log(`Sucess sign up ${JSON.stringify(user)}`)
    } catch (err) {
      console.log("Error sign up", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-sm">
      <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border rounded-md text-black"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-md text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-md text-black"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default SignUp;
