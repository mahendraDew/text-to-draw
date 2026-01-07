import { Router } from "express"
import bcrypt from "bcrypt"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { userMiddleware } from "../middleware/userMiddleware";
import {CreateUserSchema, SignInSchema, CreateRoomSchema} from "@repo/common/types";
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
    const parsedDataWithSuccess  = CreateUserSchema.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        res.json({
            msg: "something wrong in input",
            //TODO: provide valid error log
            error: parsedDataWithSuccess
        })
    }
    //user data from req after zod validation
    const {email, password, firstname, lastname} = req.body;
    try {
        //hashed password
        const hashedpass = await bcrypt.hash(password, 5);
        console.log({
                    email: email,
                    password: hashedpass,
                    lastname: lastname,
                    firstname: firstname

        }
        )
        //TODO: hit the db and check if any entry is ther with this email (email must be uniue)
        // await prisma.user.create({
        //     data: {
        //         email: email,
        //         password: hashedpass,
        //         lastname: lastname,
        //         firstname: firstname
        //     }
        // })

        //TODO: put the data in the db
        
        res.json({
            msg: "user signup succeeded!"
        })
        
    } catch (error) {
        res.status(511).json({
            msg:"Something went wrong!"
        }) 
    }    
})


userRouter.post("/signin", (req, res)=>{
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
    // const user = // hit the db and if not user then run below logic 
    // if(!user){
    //     res.json({
    //         msg: "user not found"
    //     })
    // }
    // console.log("pass:", password)
    // console.log("user pass:", user.pass)
    // const passMatch = await bcrypt.compare(password, user.pass);

    //dummy data 
        const passMatch = true   
        const user = {"id":1};
    if(passMatch){
        const token = jwt.sign({
            id: user.id
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

userRouter.post("/room", userMiddleware, (req, res) => {
    
        const parsedDataWithSuccess  = CreateRoomSchema.safeParse(req.body);
        if(!parsedDataWithSuccess.success){
            res.json({
                msg: "something wrong in input",
                //TODO: provide valid error log
                error: parsedDataWithSuccess
            })
        }

    
        //TODO: db call

        res.json({
            //TODO: fix this.. shouldnt return hardcoded value 
            roomId : 123
        })
})


