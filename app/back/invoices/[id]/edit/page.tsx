"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserPage } from '@/lib/context/page/userPageContext';
import { useUsers } from '@/lib/context/collection/usersContext';

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, setUser } = useUserPage();
  const [name, setName] = useState(user?.name || '');
  // const [age, setAge] = useState(user?.age || 0);
  const { users } = useUsers();

  if (user === null || user.id !== params.id) {

    const foundUser = users.find(s => s.id === params.id);
    if (foundUser)
      setUser(foundUser);
  }


  if (user === null) {
    return (
      <div>
        <h1>User Not Found</h1>
        <Link href="/back/users">
          <button>Back to User List</button>
        </Link>
      </div>
    );
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.back();
  };

  return (
    <div className="edit-page">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* <div>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div> */}
        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => router.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}