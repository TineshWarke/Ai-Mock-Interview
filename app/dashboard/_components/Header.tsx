'use client';

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const Header = () => {
    const path = usePathname();
    const router = useRouter();

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Questions', path: '/dashboard/questions' },
        { label: 'Upgrade', path: '/dashboard/upgrade' },
        { label: 'How it Works?', path: '/dashboard/howitworks' },
    ];

    return (
        <nav className="navbar bg-base-100 shadow-sm shadow-cyan-200">
            {/* Logo */}
            <div className="navbar-start ml-3">
                <Image src="/coder.png" width={30} height={30} alt="Logo" />
                <h2 className='text-cyan-500 font-bold text-2xl ml-2'>Tinesh</h2>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <button
                                className={`cursor-pointer ${path === item.path ? 'text-cyan-500 font-bold' : ''}`}
                                onClick={() => router.push(item.path)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* User Profile */}
            <div className="navbar-end mr-3">
                <UserButton />
            </div>
        </nav>
    );
};

export default Header;
