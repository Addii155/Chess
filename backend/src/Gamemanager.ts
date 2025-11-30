import { WebSocket } from "ws";
import { INIT_GAME, MOVE_MESSAGE } from "./message.js";
import { Game } from "./Game.js";


export class GameManager {
    private games: Game[];
    private users: WebSocket[];
    private waitingUser: WebSocket | null;

    constructor() {
        this.games = [];
        this.users = [];
        this.waitingUser = null;
    }

    public addUser(socket: WebSocket) {
        this.users.push(socket);
        console.log("[GameManager] New user added. Total users:", this.users.length);
        this.addHandler(socket);
    }

    public removeUser(socket: WebSocket) {
        this.users = this.users.filter((s) => s !== socket);
        console.log("[GameManager] User removed. Total users:", this.users.length);
        // Optional: Handle user disconnection from active game if needed
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                switch (message.type) {
                    case INIT_GAME:
                        if (this.waitingUser) {
                            console.log("Starting new game");
                            const newGame = new Game(this.waitingUser, socket);
                            this.games.push(newGame);
                            console.log("New game started between two players");
                            this.waitingUser = null;
                        } else {
                            console.log("Waiting for an opponent...");
                            this.waitingUser = socket;
                        }
                        break;
                    case MOVE_MESSAGE:
                        const game = this.games.find((g) => g.player1 === socket || g.player2 === socket);
                        if (game) {
                            game.makeMove(socket, message.move as {
                                from: string,
                                to: string
                            });
                        }
                        break;
                }
            } catch (error: any) {
                console.error("[GameManager] Error parsing message:", error);
            }
        });
    }
}