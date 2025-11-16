import {WebSocket} from "ws";
import { Chess } from "chess.js";
export class Game {
    public player1 : WebSocket;
    public player2 : WebSocket;
    move : string[];
    startTime : Date;
    board : Chess;
    moveCounter :number ;
    constructor(player1:WebSocket, player2:WebSocket)
    {
        this.player1 = player1;
        this.player2 = player2;
        this.startTime = new Date();
        this.move = [];
        this.board = new Chess();
        this.moveCounter = 0;
        player1.send(JSON.stringify({type:'game_start', color:'w'}));
        player2.send(JSON.stringify({type:'game_start', color:'b'}));

    }
    makeMove(socket,move: {from:string, to:string})
    {
        if((this.moveCounter %2 ===0 && socket === this.player1) || (this.moveCounter %2 ===1 && socket === this.player2))
        {
            try {
                const result = this.board.move({from:move.from, to:move.to});
                if(result)
                {
                    this.moveCounter++;
                    const message = JSON.stringify({type:'move_made', move: result});
                    this.player1.send(message);
                    this.player2.send(message);
                }
            } catch (error: any) {
                console.error('Invalid move:', error);
                socket.send(JSON.stringify({type:'invalid_move', error: error.message}));
                

            }
        }
    }

}