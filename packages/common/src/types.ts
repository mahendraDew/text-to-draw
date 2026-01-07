import {z} from "zod"

export const CreateUserSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(30),
    firstname: z.string().min(3).max(20),
    lastname: z.string().min(3).max(30)
})

export const SignInSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(30),
    
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})

