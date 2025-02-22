'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(1 * 60);
    const [isVerify, setVerify] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (timer === 0) {
            setVerify(false)
            setTimer(0);
            return
        }
        const interVal = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interVal);
    }, [timer]);
    const second = timer % 60
    const minute = Math.floor(timer / 60);

    const sendCode = async () => {
        setVerify(true)
        setLoading(true);
        try {
            const response = await fetch('/api/resend-code', { method: 'GET' });
            const data = await response.json();
            setMessage(data.message);
            setLoading(false);
            if (data.success) {
                setTimer(1 * 60);
            }
            setTimeout(() => {
                setMessage('')
            }, 1000);
        } catch (error) {
            console.log(error)
        }
        setCode('');
    }
    const verifyCode = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            const data = await response.json();
            setMessage(data.message);
            setTimeout(() => {
                setMessage('');
            }, 1000);
            setLoading(false);
            if (data.success) {
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        }
        setCode('');
    }

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center gap-y-5'>

            <h1 className='text-4xl font-semibold'>Verify your email</h1>
            <p>Don't refresh the page</p>

            <div className="w-80 h-72 flex flex-col gap-y-3 items-center justify-center rounded-md shadow-[0_0_10px_rgba(69,10,10,1)] bg-gradient-to-r from-pink-900 via-pink-800 to-pink-900 relative overflow-hidden z-10">

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

                <input type="text" className='w-24 py-2 px-2 outline-none rounded-md text-black font-bold text-2xl' value={code} onChange={(e) => setCode(e.target.value)} />

                <button className='px-8 py-2 text-white self-center mt-4 text-lg font-medium rounded-md hover:bg-pink-900 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,0.8)]' onClick={isVerify ? verifyCode : sendCode}>{isVerify ? 'Verify' : 'Send Code'}</button>

                <p className='text-xl mt-5 font-semibold'>0{minute}:{second < 10 ? `0${second}` : second}</p>
            </div>
        </div>
    )
}

export default page