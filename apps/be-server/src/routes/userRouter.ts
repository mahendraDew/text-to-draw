import { Router } from "express"
import { bcrypt } from "bcrypt"
import { z } from "zod"
import { jwt } from "jsonwebtoken"
import { userMiddleware } from "../middleware/userMiddleware";
export const userRouter = Router();

const USER_JWT_SECRET=process.env.USER_JWT_SECRET || "JsonewbtokenSECRET";
//endpoints
userRouter.get("/health", (req, res)=>{
    res.json({
        msg: "server is healthy!"
    })
})


userRouter.post("/signup", async (req, res)=>{
    //zod validation
    const reqUserData = z.object({
        email: z.email(),
        password: z.string().min(8).max(30),
        firstname: z.string().min(3).max(20),
        lastname: z.string().min(3).max(30)
    })
    const parsedDataWithSuccess  = reqUserData.safeParse(req.body);
    if(!parsedDataWithSuccess){
        res.json({
            msg: "something wrong in input",
            error: parsedDataWithSuccess.error
        })
    }
    //user data from req after zod validation
    const {email, password, firstname, lastname} = req.body;

    try {
        //hashed password
        const hashedpass = await bcrypt.hash(password, 5);

        //TODO: hit the db and check if any entry is ther with this email (email must be uniue)

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
        }, USER_JWT_SECRET)

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
        //TODO: db call

        res.json({
            //TODO: fix this.. shouldnt return hardcoded value 
            roomId : 123
        })
})


