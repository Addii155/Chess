import type { Chess, Square, PieceSymbol, Color } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

type BoardSquare = {
    square: Square;
    type: PieceSymbol | null;
    color: Color | null;
};

const Chessboard = ({
    board,
    chess,
    socket,
    color
}: {
    board: BoardSquare[][];
    chess: Chess;
    socket: WebSocket;
    color: "w" | "b" | null;
}) => {
    const [from, setFrom] = useState<Square | null>(null);
    const [legalMoves, setLegalMoves] = useState<Square[]>([]);

    const handleClick = (square: BoardSquare | null) => {
        if (!square) return;

        const clicked = square.square;

        // FIRST CLICK
        if (!from) {
            if (square.color !== color) return;

            setFrom(clicked);

            const moves = chess
                .moves({ square: clicked, verbose: true })
                .map((m) => m.to as Square);

            setLegalMoves(moves);
            return;
        }

        // SECOND CLICK → send to server
        socket.send(
            JSON.stringify({
                type: MOVE,
                move: { from, to: clicked }
            })
        );

        setFrom(null);
        setLegalMoves([]);
    };

    return (
        <div>
            {board.map((row, r) => (
                <div key={r} style={{ display: "flex" }}>
                    {row.map((sq, c) => {
                        const squareName = sq?.square ?? null;
                        const selected = squareName === from;
                        const highlight = legalMoves.includes(squareName as Square);

                        const background = selected
                            ? "yellow"
                            : highlight
                            ? "lightgreen"
                            : (r + c) % 2 === 0
                            ? "beige"
                            : "brown";

                        return (
                            <div
                                key={c}
                                onClick={() => handleClick(sq)}
                                style={{
                                    width: 50,
                                    height: 50,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: background
                                }}
                            >
                                {sq?.type && (
                                    <span
                                        style={{
                                            color: sq.color === "w" ? "white" : "black",
                                            fontSize: 32,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {sq.type}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Chessboard;
