import User from "@/models/users";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { connectDB } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

const usernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam);
        if (!result.success) {

            return NextResponse.json({
                message: "Invalid username",
                success: false
            }, { status: 400 })
        }

        await connectDB();

        const { username } = result.data;

        const existedUser = await User.findOne({ username, isVerified: true }).select("-password -isVerified");
        if (existedUser) {
            return NextResponse.json({
                message: "Username already taken",
                success: false
            },{ status: 400 })
        }

        return NextResponse.json({
            message: "Username is available",
            success: true
        }, { status: 200 })

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message,
                success: false
            }, { status: 500 })
        }
    }
}