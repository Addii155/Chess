import type { Chess, Square, PieceSymbol, Color } from "chess.js";
import { useState, useEffect, useRef } from "react";
import { MOVE } from "@/utils/move";

type BoardSquare = {
    square: Square;
    type: PieceSymbol | null;
    color: Color | null;
};

const pieceImages: Record<string, string> = {
    "p_w": "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
    "n_w": "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
    "b_w": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
    "r_w": "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
    "q_w": "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
    "k_w": "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
    "p_b": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
    "n_b": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
    "b_b": "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
    "r_b": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
    "q_b": "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
    "k_b": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
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
    const [squareSize, setSquareSize] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateSquareSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;
                const size = Math.min(containerHeight / 8, containerWidth / 8);
                setSquareSize(size);
            }
        };

        updateSquareSize();
        window.addEventListener('resize', updateSquareSize);
        return () => window.removeEventListener('resize', updateSquareSize);
    }, []);

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

    // If player is black, reverse the board for display
    const displayBoard = color === 'b'
        ? [...board].reverse().map(row => [...row].reverse())
        : board;

    return (
        <div ref={containerRef} className=" " style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            {displayBoard.map((row, r) => (
                <div key={r} className="grid-row-8 w-full" style={{ display: "flex" }}>
                    {row.map((sq, c) => {
                        const squareName = sq?.square ?? null;
                        const selected = squareName === from;
                        const highlight = legalMoves.includes(squareName as Square);

                        // Calculate actual rank and file for coloring
                        // If flipped, r=0 is rank 1, c=0 is file h
                        // But we just need alternating colors.
                        // (r+c)%2 works for standard board. 
                        // If we flip both rows and cols, the parity is preserved?
                        // Let's check: 
                        // Standard: (0,0) is a8 (white). 0+0=0 even -> beige. Correct.
                        // Flipped: (0,0) is h1 (white). 0+0=0 even -> beige. Correct.

                        const background = selected
                            ? "rgba(255, 255, 0, 0.5)"
                            : highlight
                                ? "rgba(0, 255, 0, 0.3)"
                                : (r + c) % 2 === 0
                                    ? "#EEEED2" // Light square
                                    : "#769656"; // Dark square

                        return (
                            <div
                                key={c}
                                onClick={() => handleClick(sq)}
                                
                                style={{
                                    width: squareSize,
                                    height: squareSize,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: background,
                                    cursor: "pointer",
                                    position: "relative"
                                }}
                            >
                                {sq?.type && sq.color && (
                                    <img
                                        src={pieceImages[`${sq.type}_${sq.color}`]}
                                        alt={`${sq.color} ${sq.type}`}
                                        style={{ width: "90%", height: "90%" }}
                                    />
                                )}
                                {/* Optional: Show coordinate notation if needed */}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Chessboard;
