import {WebSocket} from "ws";
import { INIT_GAME, MOVE_MESSAGE } from "./message.js";
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
        console.log("[GameManager] New user added. Total users:", this.User.length);
        this.addhandler(socket);
    }
    public removeUser(socket:WebSocket)
    {
        this.User = this.User.filter((s) => s !== socket);
    }
    private addhandler(socket:WebSocket)
    {
        socket.on('message', (data)=>{
            try {
                const message = JSON.parse(data.toString());
                switch(message.type)
                {
                    case INIT_GAME:
                        if(this.waitingUser)
                        {
                            console.log("Starting new game");
                            const newGame = new Game(this.waitingUser, socket);
                            this.game.push(newGame);
                            console.log("New game started between two players");    
                            this.waitingUser = null;
                        }
                        else {
                            console.log("Waiting for an opponent...");
                            this.waitingUser = socket;
                        }
                        break;
                    case MOVE_MESSAGE:
                        const game = this.game.find((g) => g.player1 ===socket || g.player2 === socket)
                        if(game)
                        {
                            game.makeMove(socket, message.move as {
                                from: string,
                                to: string
                            } )
        
                        }

                }
            } catch (error: any) {
                console.error("[GameManager] Error parsing message:", error);
            }
        })
    }
}