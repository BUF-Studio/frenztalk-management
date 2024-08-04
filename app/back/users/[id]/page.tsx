"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserPage } from '@/lib/context/page/userPageContext';
import Link from 'next/link';
import { useUsers } from '@/lib/context/collection/usersContext';
import UserForm from '../userForm';
import { UserRole } from '@/lib/models/user';

export default function EditUser({ params }: { params: { id: string } }) {
  const { user, setUser } = useUserPage();
  const router = useRouter();

  const { verifiedUsers } = useUsers();
  if (user === null) {
    return (
      <div>
        <h1>User Not Found</h1>

        <button onClick={(e) => { router.back() }}>Back</button>

      </div>
    );
  }


  if (user === null || user.id !== params.id) {
    const foundUser = verifiedUsers.find(s => s.id === params.id);
    if (foundUser)
      setUser(foundUser);
  }


  return (
    <div className="edit-page">
      <h2>{user.role === UserRole.NON_VERIFIED ? 'Approve User' : 'Edit User'}</h2>
      <button onClick={(e)=> router.back()}>Back</button>
      <UserForm></UserForm>
    </div>
  );
}