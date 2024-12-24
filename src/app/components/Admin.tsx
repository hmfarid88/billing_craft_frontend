"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from '../store';

const Admin = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
    const [password, setPassword] = useState('');

    const handleAdmin = async (e: any) => {
        e.preventDefault();

        if (!username?.trim() || !password?.trim()) {
            toast.info("Username and password are required!");
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/auth/adminValidate?username=${username}&password=${password}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                toast.success("Login successful!");
                router.push(`/adminstration?access=granted`);
                setPassword("");
            } else {
                const error = await response.text();
                toast.info(error);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again!");
        }
    };
    return (
        <div className="flex flex-col gap-3 justify-center items-center font-bold">
            <input type='text' placeholder='Password' className='input input-sm input-success w-full max-w-xs' value={password} onChange={(e: any) => setPassword(e.target.value)} />
            <button onClick={handleAdmin} className='btn btn-sm btn-success w-full max-w-xs'> GO </button>
        </div>
    )
}

export default Admin