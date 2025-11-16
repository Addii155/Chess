import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { INIT_GAME } from "./message.js";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;

    private moves: string[];
    private board: Chess;
    private moveCounter: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.moveCounter = 0;

        // Send initial messages
        player1.send(JSON.stringify({ type: INIT_GAME, color: "w" }));
        player2.send(JSON.stringify({ type: INIT_GAME, color: "b" }));
    }

    public makeMove(socket: WebSocket, move: { from: string; to: string }) {
        // 1. Validate whose turn it is
        const isWhiteTurn = this.moveCounter % 2 === 0;
        const correctPlayer =
            (isWhiteTurn && socket === this.player1) ||
            (!isWhiteTurn && socket === this.player2);

        if (!correctPlayer) {
            socket.send(
                JSON.stringify({
                    type: "invalid_turn",
                    message: "It's not your turn!",
                })
            );
            return;
        }

        try {
            // 2. Attempt move
            const result = this.board.move(move);

            if (!result) {
                socket.send(
                    JSON.stringify({
                        type: "invalid_move",
                        message: "Illegal move",
                    })
                );
                return;
            }

            // 3. Valid move
            this.moveCounter++;
            this.moves.push(result.san);

            const message = JSON.stringify({
                type: "move_made",
                move: result,
                board: this.board.fen(),
            });

            this.player1.send(message);
            this.player2.send(message);
            if (this.board.isGameOver()) {
                const resultMessage = JSON.stringify({
                    type: "game_over",
                    reason: this.getGameResult(),
                });

                this.player1.send(resultMessage);
                this.player2.send(resultMessage);
            }

        } catch (error: any) {
            console.error("[Game] Error making move:", error);
            socket.send(
                JSON.stringify({
                    type: "error",
                    message: error.message,
                })
            );
        }
        console.log(this.board.ascii())
    }

    private getGameResult() {
        if (this.board.isCheckmate()) {
            return "checkmate";
        }
        if (this.board.isDraw()) {
            return "draw";
        }
        if (this.board.isStalemate()) {
            return "stalemate";
        }
        if (this.board.isThreefoldRepetition()) {
            return "threefold repetition";
        }
        return "game over";
    }
}
