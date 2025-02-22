import { mongoClient } from "@/lib/mongoClient";
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'

export const POST = async(request) => {
    const token = request.cookies;
    const tokenMail = token.get('verify')?.value;
    const decodedMail = jwt.verify(tokenMail, process.env.JWT_SECRET);
    const email = decodedMail.email;
    const collection = (await mongoClient()).collection('newusers');
    try {
        const {password, confirmPass} = await request.json();
        console.log(password, confirmPass);

        if (!password || !confirmPass) {
            return NextResponse.json({message: 'Please type a password', success: false});
        }

        if (password.length < 6 || confirmPass.length < 6) {
            return NextResponse.json({message: 'Password required minimum 6 digit', success: false});
        }

        if (password !== confirmPass) {
            return NextResponse.json({message: 'Password does not match', success: false});
        }

        const data = await collection.findOne({email});
        const comparePass = await bcrypt.compare(confirmPass, data.password);

        if (comparePass) {
            return NextResponse.json({message: 'You entered old password', success: false});
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(confirmPass, genSalt);

        if (password === confirmPass) {
            await collection.findOneAndUpdate({email}, {$set: {
                password:hashedPass
            }});
            const response = NextResponse.json({message: 'Password changed successfully', success: true});
            response.cookies.delete('verify');
            response.cookies.delete('set-pass');
            return response
        }
    } catch (error) {
        return NextResponse.json({message: 'Failed to change password', success: false});
    }
}