import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/webserver";
import { Chess } from "chess.js";
import Chessboard from "../components/Chessboard";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const MOVE_MADE = "move_made";
export const GAME_OVER = "game_over";

const Game = () => {
    const socket = useWebSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(normalizeBoard(new Chess().board()));
    const [Started, setStarted] = useState(false);
    const [color, setColor] = useState<"w" | "b" | null>(null);

    function normalizeBoard(b: any[][]) {
        return b.map((row, r) =>
            row.map((sq, c) => {
                if (!sq) {
                    const file = "abcdefgh"[c];
                    const rank = 8 - r;
                    return { square: `${file}${rank}`, type: null, color: null };
                }
                return sq;
            })
        );
    }

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            switch (msg.type) {
                case INIT_GAME:
                    setStarted(true);
                    setColor(msg.color);
                    setBoard(normalizeBoard(chess.board()));
                    break;

                case MOVE_MADE:
                    // backend sends updated fen
                    const newChess = new Chess(msg.board);
                    setChess(newChess);
                    setBoard(normalizeBoard(newChess.board()));
                    break;

                case GAME_OVER:
                    console.log("Game Over:", msg.result);
                    break;

                default:
                    break;
            }
        };
    }, [socket]);

    if (!socket) return <div>Connecting to server...</div>;

    return (
        <div>
            {Started ? (
                <Chessboard
                    board={board}
                    chess={chess}
                    socket={socket}
                    color={color}
                />
            ) : (
                <div>
                    <div>Waiting for an opponent...</div>

                    <button
                        onClick={() =>
                            socket.send(JSON.stringify({ type: INIT_GAME }))
                        }
                    >
                        Play
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game;
