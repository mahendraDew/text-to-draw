import { WebSocketServer } from "ws";
const PORT = 8080;
const wss = new WebSocketServer({port: PORT});

wss.on("connection", function connection(ws){
    ws.on("message", function message(data){
        ws.send("pong");
    })
})