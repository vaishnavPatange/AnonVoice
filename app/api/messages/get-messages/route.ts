import User from "@/models/users";
import Message from "@/models/message";
import { connectDB } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession, User as UserType } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function GET(request: NextRequest) {

    const session = await getServerSession(authOptions);
    const user: UserType = session?.user as UserType;
    if (!session || !session.user) {
        return NextResponse.json({
            message: "Unathenticated user",
            success: false
        }, { status: 401 })
    }

    try {
        // const url = new URL(request.nextUrl);

        await connectDB();
        const userMessages = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(user._id)
                }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "messages",
                    foreignField: "_id",
                    as: "fetchedMessages"
                }
            },
            {
                $project: {
                    fetchedMessages: 1,
                }
            },
            {
                $sort:{
                    'fetchedMessages.createdAt': -1
                }
            }
        ]);

        console.log(userMessages);

        if (userMessages.length === 0) {
            return NextResponse.json({
                message: "No message found",
                success: false
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "user message fetch successfully",
            success: true,
            allUserMessages: userMessages[0].fetchedMessages
        }, { status: 200 })


    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message,
                success: false
            }, { status: 500 })
        }
    }
}