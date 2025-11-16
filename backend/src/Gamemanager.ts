import {WebSocket} from "ws";
import { INIT_MESSAGE, MOVE_MESSAGE } from "./message.js";
import { Game } from "./Game.js";


export class GameManager {
    private game : Game[];
    private User : WebSocket[];
    private waitingUser : WebSocket | null;
    
    constructor()
    {
        this.game = [];
        this.User = [];
        this.waitingUser = null;
    }
    public addUser(socket:WebSocket)
    {
        this.User.push(socket)
        this.addhandler(socket);
    }
    public removeUser(socket:WebSocket)
    {
        this.User = this.User.filter((s) => s !== socket);
    }
    private addhandler(socket:WebSocket)
    {
        socket.on('message', (data)=>{
            const message = JSON.parse(data.toString());
            switch(message.type)
            {
                case INIT_MESSAGE:
                    if(this.waitingUser)
                    {
                        const newGame = new Game(this.waitingUser, socket);
                        this.game.push(newGame);
                        this.waitingUser = null;
                    }
                    else {
                        this.waitingUser = socket;
                    }
                    break;
                case MOVE_MESSAGE:
                    const game = this.game.find((g) => g.player1 ===socket || g.player2 === socket)
                    if(game)
                    {
                        game.makeMove(socket, message.move: {
                            from: string,
                            to: string
                        } )
    
                    }

            }
        })
    }
}