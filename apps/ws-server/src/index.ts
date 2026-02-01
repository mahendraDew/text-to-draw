import { WebSocket, WebSocketServer } from "ws";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";

const PORT = 8080;
const wss = new WebSocketServer({port: PORT});
console.log(`ws server is running on ${PORT}...`)
import {JWT_SECRET} from "@repo/be-common/config"

interface User {
    ws: WebSocket,
    rooms: number[],
    userId: string
}

interface wsMessage{
    type: string,
    roomId: number,
    message?: string
}

const users: User[] = [];


function checkUser(token: string){
    try {
        const decoded: JwtPayload  =jwt.verify(token, JWT_SECRET) as JwtPayload;
        // console.log(decoded);
        if(typeof decoded == "string"){ 
            return null;
        }
    
        if(!(decoded) || !(decoded.id)){
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
    
    if (!token || token == null) {
        ws.close(1008, "Unauthorized");
        return;
    }
    const userId = checkUser(token);

    if(userId == null){
        ws.close();
        return null;
    }

    users.push({
        ws,
        userId,
        rooms: []
    })

    console.log("user connected...")
    
    try {
        //create a room on the db       
               
        ws.on("message", async function message(data){  // this data should be of type this : {type: "join_room", roomId=1}
            const parsedData: wsMessage = JSON.parse(data as unknown as string);   
            if(parsedData.type === "join_room"){
                const user = users.find(x => x.ws==ws);
                //TODO: check even if this room actually exist in the db
                user?.rooms.push(parsedData.roomId)
                console.log("joined a new user, users: ", users)
                
             }
            
            if(parsedData.type === "leave_room"){
                const user = users.find(x => x.ws==ws);
                if(!user){
                    return null;
                }
                //TODO: check even if this room actually exist in the db
                user.rooms = user?.rooms.filter(x => x !== parsedData.roomId);
                console.log("joined a new user, users: ", users)

             }

             
            if(parsedData.type === "chat"){
               const roomId = parsedData.roomId;
               //TODO: check if message is not too long also that this doesnt contain any misc info/code
               const message = parsedData.message;
               console.log(roomId, message)
               
                if(!message){
                    ws.close();
                    return null;
                }

                // TODO: make sure rooom with this roomid does exist in the db
               await prismaClient.chat.create({
                data:{
                    message: message,
                    roomId: roomId,
                    userId: userId

                }
               })

               users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId: roomId
                    }))
                }
               })

             }
        })
    } catch (error) {
        console.log("invalid token")   
    }
})