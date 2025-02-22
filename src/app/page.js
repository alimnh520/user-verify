'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { ImEye } from "react-icons/im";
import { PiEyeClosedBold } from "react-icons/pi";

const page = () => {
    const [forgetPass, setForgetPass] = useState(false);
    const [forgetMail, setForgetMail] = useState('');
    const [userType, setUserType] = useState(false);
    const [showPass, setShowPass] = useState(true);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    });
    const router = useRouter();

    const handleChange = (val) => {
        setUser({ ...user, [val.target.name]: val.target.value });
    }

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email, password: user.password })
            });
            const data = await response.json();
            setMessage(data.message);
            setLoading(false);
            setTimeout(() => {
                setMessage('');
            }, 1500);
            if (data.success) {
                router.push('/homepage');
            }
            if (data.success === 'verify') {
                await fetch('/api/resend-code', { method: 'GET' })
                router.push('/verify-user');
            }
        } catch (error) {
            console.log(error);
        }
        setUser({
            username: '',
            email: '',
            password: ''
        });
    }

    const handleSignUp = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: user.username, email: user.email, password: user.password })
            });
            const data = await response.json();
            setLoading(false);
            setMessage(data.message);
            setTimeout(() => {
                setMessage('');
            }, 1500);
            if (data.success) {
                router.push('/verify-user');
            }
        } catch (error) {
            console.log(error);
        }
        setUser({
            username: '',
            email: '',
            password: ''
        });
    }

    const handleForget = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/forget-pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: forgetMail })
            });
            const data = await response.json();
            setMessage(data.message);
            setTimeout(() => {
                setMessage('');
            }, 1500);
            setLoading(false);
            if (data.success) {
                router.push('/forget-verify');
            }
        } catch (error) {
            console.log(error);
        }
        setForgetMail('');
    }


    return (
        <div className={`w-full h-screen flex items-center justify-center ${loading ? 'pointer-events-none' : 'pointer-events-auto'}`}>

            <div className='w-80 h-[360px] flex items-center justify-center rounded-md shadow-[0_0_10px_rgba(69,10,10,1)] bg-gradient-to-r from-pink-900 via-pink-800 to-pink-900 relative overflow-hidden z-10'>
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

                <div className={`w-full h-full p-4 flex-col items-center justify-start gap-y-2 absolute transition-all duration-300 ${forgetPass ? 'hidden' : 'flex'} ${userType ? 'left-0' : 'left-full'}`}>
                    <h1 className='text-2xl font-semibold font-mono'>Signup</h1>

                    <input type='text' name='username' placeholder='Enter your user username....' className={`w-full py-2 outline-none px-4 text-lg font-medium text-black rounded-md placeholder:text-sm mt-5`} value={user.username} onChange={handleChange} />

                    <input type='email' name='email' placeholder='Enter your email....' className='w-full py-2 outline-none px-4 text-lg font-medium text-black rounded-md placeholder:text-sm mt-2' value={user.email} onChange={handleChange} />

                    <div className='w-full relative flex items-center justify-center'>
                        <input type={showPass ? 'password' : 'text'} name='password' placeholder='Enter your password....' className='w-full py-2 outline-none px-4 text-lg font-medium text-black rounded-md placeholder:text-sm mt-2' value={user.password} onChange={handleChange} />

                        <div className=" absolute right-4 text-gray-800 z-10 mt-1 cursor-pointer text-lg" onClick={() => setShowPass(!showPass)}>
                            {showPass ? <PiEyeClosedBold className='text-xl mt-0.5 -mr-px' /> : <ImEye />}
                        </div>
                    </div>

                    <button className='text-sm self-end underline' onClick={() => setUserType(false)}>Or Login</button>

                    <button className={`px-8 py-2 text-white self-center mt-2 text-lg font-medium rounded-md hover:bg-pink-900 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,0.8)]`} onClick={handleSignUp}>Signup</button>

                </div>

                <div className={`w-full h-full p-4 flex-col items-center justify-center gap-y-2 absolute transition-all duration-300 ${forgetPass ? 'hidden' : 'flex'} ${userType ? 'right-full' : 'right-0'}`}>
                    <h1 className='text-2xl font-semibold font-mono'>Login</h1>

                    <input type='email' name='email' placeholder='Enter your email....' className='w-full py-2 outline-none px-4 text-lg font-medium text-black rounded-md placeholder:text-sm mt-2' value={user.email} onChange={handleChange} />

                    <div className='w-full relative flex items-center justify-center'>
                        <input type={showPass ? 'password' : 'text'} name='password' placeholder='Enter your password....' className='w-full py-2 outline-none px-4 text-lg font-medium text-black rounded-md placeholder:text-sm mt-2' value={user.password} onChange={handleChange} />

                        <div className=" absolute right-4 text-gray-800 z-10 mt-1 cursor-pointer text-lg" onClick={() => setShowPass(!showPass)}>
                            {showPass ? <PiEyeClosedBold className='text-xl mt-0.5 -mr-px' /> : <ImEye />}
                        </div>
                    </div>

                    <div className='w-full mt-3 flex items-center justify-between'>
                        <button className='text-sm underline' onClick={() => setForgetPass(true)}>forget password</button>
                        <button className='text-sm underline' onClick={() => setUserType(true)}>Or Signup</button>
                    </div>

                    <button className={`px-8 py-2 text-white self-center mt-4 text-lg font-medium rounded-md hover:bg-pink-900 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,0.8)]`} onClick={handleLogin}>Login</button>

                </div>


                <div className={`w-full h-full p-4 flex-col items-center justify-center gap-y-2 transition-all duration-300 ${forgetPass ? 'flex' : 'hidden'}`}>
                    <h1 className='text-2xl font-semibold font-mono'>Forget password</h1>

                    <input type='email' name='email' placeholder='Enter your email....' className='w-full py-2 outline-none px-4 text-lg font-medium text-black rounded-md placeholder:text-sm mt-2' value={forgetMail} onChange={(e) => setForgetMail(e.target.value)} />

                    <div className='w-full mt-3 flex items-center justify-between'>
                        <button className='text-sm underline' onClick={() => {
                            setUserType(true);
                            setForgetPass(false);
                        }}>Or Signup</button>
                        <button className='text-sm underline' onClick={() => setForgetPass(false)}>Login</button>
                    </div>

                    <button className={`px-8 py-2 text-white self-center mt-4 text-lg font-medium rounded-md hover:bg-pink-900 transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_2px_rgba(255,255,255,0.8)]`} onClick={handleForget}>Send code</button>
                </div>
            </div>
        </div>
    )
}

export default page