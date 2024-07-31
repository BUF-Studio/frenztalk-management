"use client";

import { useUsers } from '@/lib/context/collection/usersContext';
import { useUserPage } from '@/lib/context/page/userPageContext';
import Link from 'next/link';



export default function UserDetail({ params }: { params: { id: string } }) {
    const { user, setUser } = useUserPage();
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


    return (
        <div>
            <Link href="/back/users">
                <button>Back to User List</button>
            </Link>

            <div>
                <h1>User Details</h1>
                <p>Name: {user.name}</p>
                <Link href={`/back/users/${user.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>


        </div>

    );
}