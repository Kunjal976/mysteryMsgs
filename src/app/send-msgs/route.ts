import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import {Message} from "@/model/User"

export async function POST(request:Request){
    await dbconnect()
     const {username,content}=await request.json()
      try{
        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {success:false,
                    message:"user not found"
            },{status:404}
        
            )
            }
        if(!user.isAcceptingMessage) {
             return Response.json(
                {success:false,
                    message:"user is not accepting msgs"
            },
            {status:403}
        
            )
        } 
        
        const newMsg={content,createdAt:new Date()}

        user.messages.push(newMsg as Message)
        
        await user.save()
         return Response.json(
                {success:true,
                    message:"msg sent succcessfully"
            },{status:200}
        
            )
        }
        //is user accepting msgs
        catch(error){
             console.log("error in adding msgs",error)
              return Response.json(
                {success:false,
                    message:"internal serval error"
            },{status:500})
      }
}