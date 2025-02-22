'use client'
import React, { useEffect, useRef } from 'react'

const ChildCom = ({children}) => {
    const content = useRef();

    useEffect(() => {
            if (content.current) {
                for (let i = 0; i < 40; i++) {
                    const newDiv = document.createElement('span');
    
                    const randomMove = Math.floor(Math.random() * window.innerWidth);
                    const randomSize = (Math.random() * 20 + 10).toFixed(0);
                    const randomDelay = (Math.random() * 5 + 1).toFixed(0);
                    const randomTime = (Math.random() * 7 + 2).toFixed(0);
    
                    newDiv.classList.add("absolute", "ball", "opacity-0", "rounded-full", "bg-[rgba(255,255,255,0.7)]", "shadow-[0_0_10px_rgba(255,255,255,0.8)]");
                    newDiv.style.left = randomMove + 'px'
                    newDiv.style.animationDelay = randomDelay + 's'
                    newDiv.style.animationDuration = randomTime + 's'
                    newDiv.style.height = randomSize + 'px'
                    newDiv.style.width = randomSize + 'px'
                    content.current.appendChild(newDiv);
                }
            }
        }, []);

    return (
        <div className='w-full h-screen bg-gradient-to-r from-red-950 via-pink-900 to-orange-950 text-white relative overflow-hidden' ref={content}>
            {children}
        </div>
    )
}

export default ChildCom