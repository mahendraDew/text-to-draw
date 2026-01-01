import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload }  from "jsonwebtoken";

const USER_JWT_SECRET=process.env.USER_JWT_SECRET || "JsonewbtokenSECRET";

export function userMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try{

        const decode = jwt.verify(token, USER_JWT_SECRET) as JwtPayload;
        
        if(decode){
            req.user.id = decode.id;
            next(); 
        }
    }catch (err) {
    
        return res.status(401).json({ message: "Invalid token" });
    }

}