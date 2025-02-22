import { mongoClient } from "@/lib/mongoClient";
import NewUser from "@/models/NewUser";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { connectDb } from "@/lib/connectDb";
import { emailVerify } from "@/utils/mailer";

export const POST = async(request) => {
    await connectDb();
    const collection = (await mongoClient()).collection('newusers');

    try {
        const {username, email, password} = await request.json();
        const data = await collection.findOne({email});

        const adminMail = process.env.ADMIN_ROLE.split(',');
        const userRole = adminMail.includes(email) ? 'admin' : 'user';

        if (!username|| !email || !password) {
            return NextResponse.json({message: 'required all fields', success: false});
        }
        if (password.length < 6) {
            return NextResponse.json({message: 'password required minimum 6 digit', success: false});
        }
        if (data) {
            return NextResponse.json({message: 'User already exists', success: false});
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, genSalt);
        const saveUser = new NewUser({
            username,
            email,
            password: hashedPass,
            role: userRole
        });
        await saveUser.save();

        const response = NextResponse.json({message: 'registration successful', success: true});

        const verify = jwt.sign({email}, process.env.JWT_SECRET);
        response.cookies.set('verify', verify, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await emailVerify({email, otp});
        console.log(otp);
        const verifyOtp = jwt.sign({otp}, process.env.JWT_SECRET,{expiresIn: "1m"});
        response.cookies.set('verify-otp', verifyOtp, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 60 * 1000,
            path: "/"
        });
        return response
    } catch (error) {
        return NextResponse.json({message: `failed to registered `, success: true});
    }
}