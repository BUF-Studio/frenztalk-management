import Link from 'next/link';
import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="w-60 bg-gray-800 text-white h-screen p-4">
            <ul>
                <li className="mb-4"><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li className="mb-4"><Link href="/tutors" className="text-gray-300 hover:text-white">Tutors</Link></li>
                <li className="mb-4"><Link href="/students" className="text-gray-300 hover:text-white">Students</Link></li>
                <li className="mb-4"><Link href="/invoice" className="text-gray-300 hover:text-white">Invoice</Link></li>
                <li className="mb-4"><Link href="/setting" className="text-gray-300 hover:text-white">Settings</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;