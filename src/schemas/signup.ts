import {z} from 'zod'
export const usernameValid=z
  .string()
  .min(2,"user name atleast 2 characters")
  .max(20,"max 20 char")
  .regex(/^[a-zA-Z0-9]/,"SPECIAL CHAR ISN'T ALLOWED")
  
  export const signup =z.object({
     username:usernameValid,
     email:z.email({message:"invalid email"}),
     password:z.string().min(6,{message:"password limit reached"})
     
  })

 