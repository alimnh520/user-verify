import { NextResponse } from "next/server"

export const GET = async (request) => {
    try {
        const token = request.cookies;
        const isAdmin = token.get('is_admin')?.value
        if (isAdmin) {
            return NextResponse.json({ admin: true });
        }
        return NextResponse.json({ admin: false });
    } catch (error) {
        return NextResponse.json({ admin: false });
    }
}