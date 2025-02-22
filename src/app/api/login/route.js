import { mongoClient } from "@/lib/mongoClient";
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'

export const POST = async (request) => {
    try {
        const { email, password } = await request.json();
        const collection = (await mongoClient()).collection('newusers');
        const data = await collection.findOne({ email });

        if (!email || !password) {
            return NextResponse.json({ message: 'Fill the all fields', success: false });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: 'Password required minimum 6 digit', success: false });
        }

        if (!data) {
            return NextResponse.json({ message: 'User not registered', success: false });
        }
        const comparePass = await bcrypt.compare(password, data.password);

        if (!comparePass) {
            return NextResponse.json({ message: 'password is invalid', success: false });
        }

        if (data.isVerified !== true) {
            const response = NextResponse.json({ message: 'user nor verified', success: 'verify' });

            const verify = jwt.sign({ email }, process.env.JWT_SECRET);

            response.cookies.set('verify', verify, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                path: "/"
            });
            return response
        }

        const response = NextResponse.json({ message: 'Login successful', success: true, role: data.role });

        if (data.role === "admin") {
            response.cookies.set('is_admin', true, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 30 * 24 * 60 * 60,
                path: "/"
            });
        }

        response.cookies.set('user-verified', true, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60,
            path: "/"
        });
        return response
    } catch (error) {
        return NextResponse.json({ message: 'failed to login', success: false });
    }
}