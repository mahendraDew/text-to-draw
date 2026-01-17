import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";

const PORT = 8080;
const wss = new WebSocketServer({port: PORT});
console.log(`ws server is running on ${PORT}...`)
import {JWT_SECRET} from "@repo/be-common/config"
type decode = {
    id: string,
    ia: string
}
function checkUser(token: string){
    try {
        const decoded: decode  =jwt.verify(token, JWT_SECRET) as decode;
        console.log(decoded.id);
        if(typeof decoded == "string"){ 
            return null;
        }
    
        if(!(decoded) || !(decoded as decode)  || !(decoded as JwtPayload).id){
           return null;
        }
        return decoded.id;
    } catch (error) {
        return null;
    } 
}

wss.on("connection",async function connection(ws, req){
    // this is way to extract the token from url by using query params
    // const url = req.url
    // if(!url){
    //     return;
    // }
    // const queryParams = new URLSearchParams(url.split("?")[1]);
    // const token = queryParams.get('token');

    // extracting token using auth header
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    console.log("authheader: ", authHeader)
    console.log("token: ", token)
    if (!token) {
        ws.close(1008, "Unauthorized");
        return;
    }
    const userId = checkUser(token);

    if(userId == null){
        ws.close;
        return null;
    }
      
    try {
        //create a room on the db    
               
        ws.on("message", function message(data){
            console.log(data.toString())
            if(data.toString() === "ping"){
                
                ws.send("pong");
            }
        })
    } catch (error) {
        console.log("invalid token")   
    }
})