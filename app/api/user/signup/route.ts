import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import { connectDB } from "@/lib/dbConfig";
import { sendEmail } from "@/utils/sendVerifyEmail";

export async function POST(request: NextRequest) {
    try {

        await connectDB()

        const { username, email, password } = await request.json();

        const existingUserByUsername = await User.findOne({ username, isVerified: true });

        if (existingUserByUsername) {
            return NextResponse.json({
                success: false,
                message: "User already exists"
            }, { status: 400 });
        }

        const existingUserByEmail = await User.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString() ;

        if (existingUserByEmail) {

        } else {

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = await User.create({
                username,
                email,
                password,
                isVerified: false,
                verifyToken: verifyCode,
                verifyTokenExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: []
            })
        }

        // send verification email
        const emailResponse = await sendEmail(email, username, verifyCode)
        
        if(!emailResponse.ok){
            return NextResponse.json({
                message: "User verification failed",
                success: false
            }, {status: 500})
        }

        return NextResponse.json({
            success: true,
            message: "User registration successfull. Please verify you email"
        }, {status: 201})

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            message: error,
            success: false
        }, { status: 500 })
    }
}
