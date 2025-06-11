import { connectDB } from "@/lib/dbConfig";
import Message from "@/models/message";
import User from "@/models/users";
import { messageValidationSchema } from "@/schemas/messageSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const result = messageValidationSchema.safeParse(reqBody)
        if (!result.success) {
            return NextResponse.json({
                message: "Message length must be between 10-300 charachters",
                success: false
            }, { status: 400 })
        }
        await connectDB();
        const { content, username } = reqBody
        const user = await User.findOne({ username })

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 })
        }
        if (!user.isAcceptingMessage) {
            return NextResponse.json({
                message: "Currently user is not accepting messages, Please try again later",
                success: false
            }, { status: 403 })
        }

        const message = await Message.create({
            content, createdAt: new Date()
        });

        console.log(message)

        if (!message) {
            return NextResponse.json({
                message: "Something went wrong, while creating messages",
                success: false
            }, { status: 500 })
        }

        user.messages.push(message._id as mongoose.Types.ObjectId);
        await user.save();

        return NextResponse.json({
            message: "Message sent successfully",
            success: true
        }, { status: 201 })

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message,
                success: false
            }, { status: 500 })
        }
    }
}