import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";

const PORT = 8080;
const wss = new WebSocketServer({port: PORT});
console.log(`ws server is running on ${PORT}...`)
const USER_JWT_SECRET=process.env.USER_JWT_SECRET || "JsonewbtokenSECRET";

wss.on("connection", function connection(ws, req){
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
    
    const decode = jwt.verify(token, USER_JWT_SECRET);
    if(!decode || !(decode as JwtPayload).userId){
        ws.close();
        return;
    }
    
    
    ws.on("message", function message(data){
        ws.send("pong");
    })
})