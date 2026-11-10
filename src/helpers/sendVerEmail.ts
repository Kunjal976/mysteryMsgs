import {resend} from "@/lib/resend";
import verificationemail from "../../emails/verificationemail";
import {ApiResponse} from "@/types/apiResponse"


export async function sendVerEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from:'kunjal@resend.dev',
            to:email,
            subject:'Mystery message| verification code',
            react:verificationemail({username,otp:verifyCode}),
        });
      return{
      success:true ,message:"Verification email sent "}
    }
    catch(emailError){
        console.error("Error sending verification email",emailError)
        return{success:false,message:"failed to send verification email"}
    }
}