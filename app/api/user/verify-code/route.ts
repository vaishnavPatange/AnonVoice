import User from "@/models/users";
import { connectDB } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const {username, code} = await request.json();
        // somethimes in URI component changes ex: space -> %20
        const decodedUsername = decodeURIComponent(username);

        await connectDB();

        const user = await User.findOne({username: decodedUsername});
        if(!user){
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 400 })
        }

        const isValidCode = code === user.verifyToken
        const isCodeNotExpired = new Date(user.verifyTokenExpiry) > new Date();

        if(isValidCode && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return NextResponse.json({
                message: "User verification successful",
                success: true
            }, { status: 200 })
        } else if(!isCodeNotExpired){
            return NextResponse.json({
                message: "Verification code expired, please signup again to get new code",
                success: false
            }, { status: 400 })
        } else{
            return NextResponse.json({
                message: "Invalid verification code",
                success: false
            }, { status: 400 })
        }

    } catch (error: unknown) {
        if(error instanceof Error){
            return NextResponse.json({
                message: error.message,
                success: false
            }, { status: 500 })
        }
    }
}