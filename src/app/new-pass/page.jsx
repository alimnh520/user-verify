'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ImEye } from 'react-icons/im';
import { PiEyeClosedBold } from 'react-icons/pi';

const page = () => {
    const [newPass, setNewPass] = useState({
        password: '',
        confirmPass: ''
    });
    const [showPass, setShowPass] = useState(true);
    const [showPass2, setShowPass2] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);
    const router = useRouter();

    const handleChange = (val) => {
        setNewPass({ ...newPass, [val.target.name]: val.target.value });
    }

    const savePassword = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/new-pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPass.password, confirmPass: newPass.confirmPass })
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
        setNewPass({
            password: '',
            confirmPass: ''
        })
    }

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center gap-y-5'>

            <h1 className='text-4xl font-semibold'>Change your password</h1>

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

                <div className='w-full relative flex items-center justify-center'>
                    <input type={showPass ? 'password' : 'text'} name='password' placeholder='Enter your password....' className='w-full py-2 outline-none px-4 text-lg font-medium text-black rounded-md placeholder:text-sm mt-2' value={newPass.password} onChange={handleChange} />

                    <div className=" absolute right-4 text-gray-800 z-10 mt-1 cursor-pointer text-lg" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <PiEyeClosedBold className='text-xl mt-0.5 -mr-px' /> : <ImEye />}
                    </div>
                </div>
                <div className='w-full relative flex items-center justify-center'>
                    <input type={showPass2 ? 'password' : 'text'} name='confirmPass' placeholder='Enter confirm password....' className='w-full py-2 outline-none px-4 text-lg font-medium text-black rounded-md placeholder:text-sm mt-2' value={newPass.confirmPass} onChange={handleChange} />

                    <div className=" absolute right-4 text-gray-800 z-10 mt-1 cursor-pointer text-lg" onClick={() => setShowPass2(!showPass2)}>
                        {showPass2 ? <PiEyeClosedBold className='text-xl mt-0.5 -mr-px' /> : <ImEye />}
                    </div>
                </div>

                <button className='px-8 py-2 text-white self-center mt-4 text-lg font-medium rounded-md hover:bg-pink-900 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,0.8)]' onClick={savePassword}>Save</button>
            </div>
        </div>
    )
}

export default page