import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import { connectDB } from "@/lib/dbConfig";

export async function POST(request: NextRequest){
    try {

        await connectDB()

        const{username, email, password} = await request.json();

       const user = await User.create({
            username,
            email,
            password,
            verifyToken: "askdjfhlkasjdfhlasdjh"
        })

        console.log(user)

        return NextResponse.json({
            message: "User registration successfull",
            success: true
        }, {status: 201})

    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            message: error,
            success: false
        }, {status: 500})
    }
}
