import dbconnect from '@/lib/dbconnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerEmail } from "@/helpers/sendVerEmail";

export async function POST(request: Request) {
    await dbconnect();
    
    try {
        const { username, email, password } = await request.json();

        // 1. Check if username is already taken and verified
        const existingUserVerificationByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (!username){
            return Response.json({
                success : false,
                message : 'username needed'

            },{status : 400})
        }
         
        if (existingUserVerificationByUsername) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 400 });
        }

        // 2. Check if email already exists
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            // Optional logic: Handle existing email (e.g., if already verified vs. not verified)
            if (existingUserByEmail.isverified) {
                return Response.json({
                    success: false,
                    message: 'Email is already registered'
                }, { status: 400 });
            } else {
                // If user exists but isn't verified, you can update password, code, and expiry here if needed
                // For simplicity, we'll return an error or handle it per your app logic
                const hashedPassword=await bcrypt.hash(password,10)
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now() + 3600000)
                await existingUserByEmail.save()

            }
        } else {

            // 3. Create new user if email doesn't exist
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false, // Fixed casing to match convention
                isAcceptingMessage: true,
                messages: [],
            });
            await newUser.save();
        }

        // 4. Send verification mail
        const emailResponse = await sendVerEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message || 'Failed to send verification email'
            }, { status: 500 });
        }

        // 5. Return success response
        return Response.json({
            success: true,
            message: 'User registered successfully. Please verify your email.'
        }, { status: 201 });

    } catch (error) {
        console.error("Error in registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        });
    }
}