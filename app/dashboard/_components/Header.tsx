'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const Header = () => {
    const path = usePathname();
    useEffect(() => {

    }, []);

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div>
                        <Image src={'/logo.svg'} width={160} height={100} alt='logo' />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><a className={`${path === '/dashboard' && 'text-blue-500 font-bold'}`}>Dashboard</a></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a className={`${path === '/dashboard' && 'text-blue-500 font-bold'}`}>Dashboard</a></li>
                    <li><a className={`${path === '/dashboard/questions' && 'text-blue-500 font-bold'}`}>Questions</a></li>
                    <li><a className={`${path === '/dashboard/upgrade' && 'text-blue-500 font-bold'}`}>Upgrade</a></li>
                    <li><a className={`${path === '/dashboard/how' && 'text-blue-500 font-bold'}`}>How it works ?</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <UserButton />
            </div>
        </div>
    )
}

export default Header