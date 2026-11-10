import { getServerSession } from "next-auth";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbconnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Error verifying User"
        },
            { status: 401 }
        )
    }
    const userId = user._id;
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                },
                { status: 500 }
            )
        }
        else {
            return Response.json(
                {
                    success: true,
                    message: "Message acceptance is updated", updatedUser
                },
                { status: 200 }
            )
        }
    }
    catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept messages"
            },
            { status: 500 }
        )
    }


}
export async function GET(request: Request) {
    await dbconnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },
            { status: 401 }
        )
    }
    const userId = user._id;
try{
    const {acceptMessages}= await request.json()
    const foundUser = await UserModel.findById(userId)
    if (!foundUser) {
        return Response.json({
            success: false,
            message: "User not found "
        },
            { status: 404 }
        ) 
    }
     return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        },
            { status:200}
        ) 
}
catch(error){
         console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "error in getting messages"
            },
            { status: 500 }
        )
}
}