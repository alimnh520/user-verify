import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { mongoClient } from "@/lib/mongoClient";

export const POST = async (request) => {
    const collection = (await mongoClient()).collection('newusers');
    try {
        const {email} = await request.json();
        const data = await collection.findOne({email});

        if (!email) {
            return NextResponse.json({ message: 'Type a email', success: true });
        }
        if (!data) {
            return NextResponse.json({ message: 'User not registered', success: true });
        }

        const response = NextResponse.json({ message: 'code send successfully', success: true });

        const verify = jwt.sign({ email }, process.env.JWT_SECRET);
        response.cookies.set('verify', verify, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp);

        await emailVerify({email, otp});

        const verifyOtp = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: "1m" });
        response.cookies.set('verify-otp', verifyOtp, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 60 * 1000,
            path: "/"
        });
        return response
    } catch (error) {
        return NextResponse.json({ message: `failed to get forget password `, success: true });
    }
}