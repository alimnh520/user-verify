import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { emailVerify } from "@/utils/mailer";

export const GET = async (request) => {
    const token = request.cookies;
    const verifyMail = token.get('verify')?.value;
    const decodedMail = jwt.verify(verifyMail, process.env.JWT_SECRET);
    const email = decodedMail.email;
    try {
        const response = NextResponse.json({ message: 'Code resend' , success: true});
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
        return NextResponse.json({ message: 'Failed to send code' });
    }
}