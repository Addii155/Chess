import { WebSocketServer } from 'ws';
import { GameManager } from './Gamemanager.js';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);

    
    ws.on('error', (error) => {
        console.error("[Server] WebSocket error:", error);
    });

    ws.on('close', (event) => {
        console.log(event)
        console.log("[Server] Client disconnected");
        gameManager.removeUser(ws);
    });

    ws.on('message', function message(data) {
        console.log('[Server] received: %s', data);
    });

    ws.send('something');
});