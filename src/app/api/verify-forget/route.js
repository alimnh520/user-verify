import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { mongoClient } from "@/lib/mongoClient";

export const POST = async (request) => {
    const token = request.cookies;

    //verify code
    const tokenOtp = token.get('verify-otp').value;

    //verify email
    const verifyMail = token.get('verify')?.value;
    const decodedMail = jwt.verify(verifyMail, process.env.JWT_SECRET);
    const email = decodedMail.email;
    console.log(email);

    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ message: 'Please type a code', success: false });
        }
        if (code.length < 6 || code.length > 6) {
            return NextResponse.json({ message: 'required 6 digit code', success: false });
        }

        if (tokenOtp) {
            const decodedOtp = jwt.verify(tokenOtp, process.env.JWT_SECRET);
            const otp = decodedOtp.otp;
            if (code !== otp) {
                return NextResponse.json({ message: 'Invalid code', success: false });
            }
            if (code === otp) {
                const response = NextResponse.json({ message: 'verify successful', success: true });
                response.cookies.delete('verify-otp');
                response.cookies.set('set-pass', true, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "Strict",
                    path: "/"
                });
                return response
            }
        }

    } catch (error) {
        return NextResponse.json({ message: 'Wait for code resend', success: false })
    }
}