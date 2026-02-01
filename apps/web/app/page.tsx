"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";



export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div className={styles.page}>
      chat app
      <div style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
        <input onChange={(e) => {setRoomId(e.target.value)}} value={roomId} style={{padding: 5, margin:5}} placeholder="chat room name" type="text"></input>
        <button onClick={() => {router.push(`/room/${roomId}`)}}  style={{padding: 5, margin:5}}>submit</button>
      </div>
    </div>
  );
}