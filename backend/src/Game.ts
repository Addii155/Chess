import {WebSocket} from "ws";
import { Chess } from "chess.js";
export class Game {
    public player1 : WebSocket;
    public player2 : WebSocket;
    move : string[];
    startTime : Date;
    board : Chess;
    constructor(player1:WebSocket, player2:WebSocket)
    {
        this.player1 = player1;
        this.player2 = player2;
        this.startTime = new Date();
        this.move = [];
        this.board = new Chess();

    }
    makeMove(socket,move: {from:string, to:string})
    {
    
    }

}