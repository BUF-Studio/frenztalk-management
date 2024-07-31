"use client";

import { useUsers } from '@/lib/context/collection/usersContext';
import { UserRole } from '@/lib/models/user';
import Link from 'next/link';



export default function UserList() {
    const { users } = useUsers();




    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name}
                        {user.role}
                        <button>Approve</button>
                    </li>

                ))}
            </ul>
            {/* <h1>Pending User List</h1>
            <ul>
                {users.filter((user) => {
                    user.role === UserRole.ADMIN || user.role === UserRole.TUTOR
                }).map((user) => (
                    <li key={user.id}>
                        {user.name}
                        <button>Approve</button>
                    </li>

                ))}
            </ul>

            <h1>Active User List</h1>
            <ul>
                {users.filter((user) => {
                    user.role === UserRole.NON_VERIFIED
                }).map((user) => (
                    <li key={user.id}>
                        <Link href={`/back/users/${user.id}`}>
                            {user.name}
                        </Link>
                    </li>
                ))}
            </ul> */}


        </div>
    );
}