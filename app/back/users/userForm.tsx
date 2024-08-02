

"use client";
import { useState } from 'react';
import { User, UserRole } from '@/lib/models/user';
import { useUserPage } from '@/lib/context/page/userPageContext';
import { addUser, updateUser } from '@/lib/firebase/user';
import { useRouter } from 'next/navigation';

export default function UserForm() {
    const router = useRouter();
    const { user, setUser } = useUserPage();
    const [name, setName] = useState(user!.name);
    const [role, setRole] = useState(user!.role);

    // console.log(user.id)

    const viewTutor = ()=>{
        if (user && user.id) {
            router.push(`/back/tutors/${user.id}`);
          }
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const updatedUser = new User(user!.id, name, user!.email, role);
            await updateUser(updatedUser)
            console.log('update')

            setUser(updatedUser)
            // router.push('/back/users')

        } catch (error) {
            console.error("Failed to submit the form", error);
        }
    };

   
    return (
        <form onSubmit={handleSubmit}>
            <div> Email : {user?.email}</div>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="user-role-dropdown">Select User Role: </label>
                <select
                    id="user-role-dropdown"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                >
                    <option value="" disabled>
                        Select a role
                    </option>
                    {Object.values(UserRole)
                        .filter(role => role !== UserRole.NON_VERIFIED)
                        .map(role => (
                            <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                        ))}
                </select>
            </div>

            <div>
                {user !== null && user.role === UserRole.TUTOR && (
                    <button onClick={viewTutor}>View Tutor</button>
                )}
            </div>


            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>


        </form>

    );
}