import type { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

type BoardSquare = {
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null;

const Chessboard = ({
  board,
  chess,
  socket,
}: {
  board: BoardSquare[][];
  chess: Chess;
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<Square | null>(null);

  const handleClick = (square: BoardSquare) => {
    if (!square) return;

    const sq = square.square;

    if (!from) {
      // First click → select FROM
      setFrom(sq);
      return;
    }

    // Second click → TO
    const move = { from, to: sq };

    socket.send(
      JSON.stringify({
        type: MOVE,
        move,
      })
    );

    setFrom(null);
  };

  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((square, colIndex) => {
            const background =
              (rowIndex + colIndex) % 2 === 0 ? "beige" : "brown";

            return (
              <div
                key={colIndex}
                onClick={() => square && handleClick(square)}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: background,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  border:
                    from === square?.square
                      ? "3px solid yellow"
                      : "1px solid black",
                }}
              >
                {square?.type && (
                  <div
                    style={{
                      color: square.color === "w" ? "white" : "black",
                    }}
                  >
                    {square.type}
                  </div>
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
