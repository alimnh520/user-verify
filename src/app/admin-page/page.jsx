'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter();
    return (
        <div className='w-full h-screen flex flex-col items-center justify-center gap-y-5'>

            <div className="w-80 h-72 flex flex-col gap-y-3 items-center justify-center rounded-md shadow-[0_0_10px_rgba(69,10,10,1)] bg-gradient-to-r from-pink-900 via-pink-800 to-pink-900 relative overflow-hidden z-10 p-5">

                <h1 className='text-xl font-semibold'>Welcome to Admin page</h1>

                <button className='px-8 py-2 text-white self-center mt-4 text-lg font-medium rounded-md hover:bg-pink-900 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,0.8)]' onClick={() => router.back()}>Go back</button>
            </div>
        </div>
    )
}

export default page