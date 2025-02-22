import { NextResponse } from "next/server"

export const GET = async(request) => {
    try {
        const response = NextResponse.json({message: 'Logout successful', success: true});
        response.cookies.delete('is_admin');
        response.cookies.delete('user-verified');
        return response
    } catch (error) {
        return NextResponse.json({message: 'Failed to logout', success: true});
    }
}