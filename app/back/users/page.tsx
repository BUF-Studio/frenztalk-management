"use client";

import { useUsers } from '@/lib/context/collection/usersContext';
import { useUserPage } from '@/lib/context/page/userPageContext';
import { User, UserRole } from '@/lib/models/user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function UserList() {
    const { verifiedUsers, unverifiedUsers } = useUsers();
    const { setUser } = useUserPage();
    const router = useRouter();


    const editUser = (user: User) => {
        setUser(user)
        router.push(`/back/users/${user.id}`)
    }

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {verifiedUsers.map((user) => (

                    <li key={user.id}>
                        <button onClick={(e) => { editUser(user) }}>
                            {user.name}
                            {user.role}
                        </button>

                    </li>

                ))}
            </ul>
            <h1>Pending User List</h1>
            <ul>
                {unverifiedUsers.map((user) => (
                    <li key={user.id}>
                        {user.name}
                        {user.role}
                        <button onClick={(e) => { editUser(user) }}>Approve</button>
                    </li>

                ))}
            </ul>
        </div>
    );
}