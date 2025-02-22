'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [message, setMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const logout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/logout', { method: 'GET' });
            const data = await response.json();
            setMessage(data.message);
            setTimeout(() => {
                setMessage('');
            }, 1500);
            if (data.success) {
                router.push('/');
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const isAdmin = async() => {
            try {
                const response = await fetch('/api/is-admin', {method: 'GET'});
                const data = await response.json();
                setIsAdmin(data.admin);
            } catch (error) {
                console.log(error);
            }
        }
        isAdmin()
    },[])
    return (
        <div className='w-full h-screen flex flex-col items-center justify-center gap-y-5'>

            <div className="w-80 h-72 flex flex-col gap-y-3 items-center justify-center rounded-md shadow-[0_0_10px_rgba(69,10,10,1)] bg-gradient-to-r from-pink-900 via-pink-800 to-pink-900 relative overflow-hidden z-10 p-5">

                {
                    message && (
                        <p className='w-10/12 text-center px-4 py-2 rounded-md bg-red-500 font-semibold absolute z-20 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>{message}</p>
                    )
                }
                {
                    loading && (
                        <div className="container absolute z-20 left-1/3  top-1/3">
                            <div className="dot"></div>
                        </div>
                    )
                }

                <h1 className='text-xl font-semibold'>Welcome to homepage</h1>


                <Link href="/admin-page" className={`px-8 py-2 ${isAdmin ? 'block':'hidden'} text-white self-center mt-4 text-lg font-medium rounded-md hover:bg-pink-900 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,0.8)]`}>Admin page</Link>
                
                <button className='px-8 py-2 text-white self-center mt-4 text-lg font-medium rounded-md hover:bg-pink-900 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,0.8)]' onClick={logout}>Logout</button>
            </div>
        </div>
    )
}

export default page