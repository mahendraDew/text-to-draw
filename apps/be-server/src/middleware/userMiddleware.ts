import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload }  from "jsonwebtoken";

// const USER_JWT_SECRET=process.env.USER_JWT_SECRET || "JsonewbtokenSECRET";
import {JWT_SECRET} from "@repo/be-common/config"

export function userMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    // try{

        const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
        
        if(decode){
            req.userId = decode.id;
            next(); 
        }
        // else{
        //     console.log("fasle h ye")
        // }
    // }catch (err) {
    //     return res.status(401).json({ message: "Invalid token" });
    // }

}