import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/webserver";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
    const socket = useWebSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case INIT_GAME:
                    
                    setBoard(chess.board());
                    break;

                case MOVE:
                    console.log("Move received:", message.move);

                    // create new Chess instance to trigger re-render
                    setChess((prev) => {
                        const newChess = new Chess(prev.fen());
                        newChess.move(message.move);
                        setBoard(newChess.board());
                        return newChess;
                    });
                    break;

                case GAME_OVER:
                    console.log("Game Over:", message.result);
                    break;

                default:
                    break;
            }
        };
    }, [socket]); // ❌ removed `chess` from dependency
    if(!socket) return <div>Connecting to server...</div>;
    return (
        <div>
            <div>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: "flex" }}>
                        {row.map((square, colIndex) => (
                            <div
                                key={colIndex}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    backgroundColor:
                                        (rowIndex + colIndex) % 2 === 0
                                            ? "white"
                                            : "gray",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "22px",
                                    fontWeight: "bold",
                                }}
                            >
                                {square ? square.type : ""}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <button className="" onClick={()=>{
                    socket.send(JSON.stringify({
                        type:"init_game"
                    }))
                }}>
                    Play 
                </button>
            </div>
        </div>
    );
};

export default Game;
