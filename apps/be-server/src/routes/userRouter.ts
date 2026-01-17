import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userMiddleware } from "../middleware/userMiddleware";
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

export const userRouter = Router();

import {JWT_SECRET} from "@repo/be-common/config"
//endpoints
userRouter.get("/health", (req, res)=>{
    res.json({
        msg: "server is healthy!"
    })
})


userRouter.post("/signup", async (req, res)=>{
    // //zod validation
    // const reqUserData = z.object({
    //     email: z.email(),
    //     password: z.string().min(8).max(30),
    //     firstname: z.string().min(3).max(20),
    //     lastname: z.string().min(3).max(30)
    // })
    // const parsedDataWithSuccess  = reqUserData.safeParse(req.body);
    const parsedData  = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            msg: "something wrong in input",
            //TODO: provide valid error log
            error: parsedData
        })
    }
    //user data from req after zod validation
    const {email, password, firstname, lastname} = req.body;
    try {
        //hashed password
        const hashedpass = await bcrypt.hash(password, 5);
        // console.log({
        //             email: email,
        //             password: hashedpass,
        //             lastname: lastname,
        //             firstname: firstname

        // })
        //TODO: hit the db and check if any entry is ther with this email (email must be uniue)
        
        //put the data in the db
        const user =  await prismaClient.user.create({
            data: {
                email: email,
                password: hashedpass,
                lastname: lastname,
                firstname: firstname
            }
        })
        
        res.json({
            msg: "user signup succeeded!",
            userId: user.id
        })
        
    } catch (error) {
        // @ts-ignore   //TODO: fix this and remove ts-ignore
        if(error.code == "P2002"){
            res.status(511).json({
                msg:"user already exists with this email!!!",
                error: error
            }) 

        }
        res.status(511).json({
            msg:"Something went wrong!",
            error: error
        }) 
    }    
})


userRouter.post("/signin", async (req, res)=>{
    const parsedDataWithSuccess  = SignInSchema.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        res.json({
            msg: "something wrong in input",
            //TODO: provide valid error log
            error: parsedDataWithSuccess
        })
    }
    const {email, password} = req.body;
    
    //TODO: find if there any user with this email
    // hit the db and if not user then run below logic 
    const user = await prismaClient.user.findFirst({
        where: {email: email}
    })
    if(!user){
        res.status(403).json({
            msg: "user not found with this email"
        })
    }
    // console.log("pass:", password)
    // console.log("user pass:", user?.password)
    const passMatch = await bcrypt.compare(password, user?.password ? user?.password : "");
    // console.log("passmatch : ", passMatch);

    // //dummy data 
    //     const passMatch = true   
    //     const user = {"id":1};
    if(passMatch){
        const token = jwt.sign({
            id: user?.id
        }, JWT_SECRET)

        res.json({
            msg: "jwt token",
            token: token
        })

    }else{
        res.status(403).json({
            msg: "incorrect cred"
        })
    }

})

userRouter.post("/room", userMiddleware, async (req, res) => {
    
        const parsedData  = CreateRoomSchema.safeParse(req.body);
        if(!parsedData.success){
            res.json({
                msg: "something wrong in input",
                //TODO: provide valid error log
                error: parsedData
            })
        }
        const userId = req.userId
        const {name} = req.body;
        await prismaClient.room.create({
            data:  {
                slug: name,
                adminId: userId
            }
        })

        console.log("hii from /room ")

    
        //TODO: db call
        res.json({
            //TODO: fix this.. shouldnt return hardcoded value 
            roomId : 123
        })
})


