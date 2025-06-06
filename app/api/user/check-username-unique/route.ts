import User from "@/models/users";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { connectDB } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

const usernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: NextRequest){
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam);
        console.log(result.success) // REMOVE LATER

        return NextResponse.json({
            message: result
        })

    } catch (error) {
        if(error instanceof Error){
        return NextResponse.json({
            message: error.message,
            success: false
        }, {status: 500})}
    }
}