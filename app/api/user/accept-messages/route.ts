import { getServerSession, User as UserType } from "next-auth";
import User from "@/models/users";
import { connectDB } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function POST(request: NextRequest) {

    const session = await getServerSession(authOptions);

    const user: UserType = session?.user as UserType;

    if (!session || !session.user) {
        return NextResponse.json({
            message: "Unauthenticated user",
            success: false
        }, { status: 401 })
    }

    const userId = user?._id;

    try {
        await connectDB();
        const { messageAcceptance } = await request.json();

        const existedUser = await User.findByIdAndUpdate(userId, {
            isAcceptingMessage: messageAcceptance
        }, { new: true });

        if (!existedUser) {
            return NextResponse.json({
                message: "Unable to find user to update message acceptance status",
                success: false
            }, { status: 404 })
        }


        return NextResponse.json({
            message: "accept messages status changed",
            success: true,
            isAcceptingMessage: existedUser.isAcceptingMessage
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

export async function GET(request: NextRequest) {

    const session = await getServerSession(authOptions);
    const user: UserType = session?.user as UserType;

    if (!session || !session.user) {
        return NextResponse.json({
            message: "Unauthenticated user",
            success: false
        }, { status: 401 })
    }

    try {
        await connectDB();

        const existedUser = await User.findById(user._id);

        if (!existedUser) {
            return NextResponse.json({
                message: "Unable to find user to get messages",
                success: false
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Messages fetched successfully",
            success: true,
            isAcceptingMessage: existedUser.isAcceptingMessage
        }, { status: 404 })

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message,
                success: false
            }, { status: 500 })
        }
    }

}