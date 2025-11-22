import { useEffect, useState } from "react";

export const URL = 'ws://localhost:8080/'

export const useWebSocket = () => {
    const [socket, setsocket] = useState<WebSocket | null>(null)
    useEffect(()=>{
        const ws = new WebSocket(URL);
        ws.onopen =()=>{
            setsocket(ws);
        }
        ws.onclose =()=>{
            setsocket(null);
        }
        return () => {
            ws.close();
        }
    },[])
    return socket;
}