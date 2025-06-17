import Message from "@/models/message";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/users";
import { getServerSession, User as UserType } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: NextRequest) {

    const session = await getServerSession(authOptions);
    const user: UserType = session?.user as UserType;
    if (!session || !session.user) {
        return NextResponse.json({
            message: "Unathenticated user",
            success: false
        }, { status: 401 })
    }

    try {

        const { messageId } = await request.json();
        await Message.findByIdAndDelete(messageId);
        const updatedUser = await User.updateOne({ _id: user._id },
            { $pull: { _id: messageId } } // $pull removes matching element from array
        );

        if (updatedUser.modifiedCount === 0) {
            return NextResponse.json({
                message: "Message not found or already deleted",
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Message deleted successfully",
            success: true
        }, { status: 200 })

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 500 });
        }
    }
}