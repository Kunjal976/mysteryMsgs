import {z} from "zod"
export const verify= z.object({
    code:z.string().length(6,"verification cod is of 6 digits")
    
})