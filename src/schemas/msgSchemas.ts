import {z} from "zod"
export const msgSchemas = z.object({
    content:z
    .string()
    .min(10,{message:"at least 10 char"})
    .max(300,{message:"must be not more that 300 char"})
    
})