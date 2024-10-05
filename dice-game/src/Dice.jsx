// Dice.jsx
import React from "react";
import { useDrag } from "react-dnd";
import "./Dice.css";

const Dice = ({ id, value, isRed, isRolling, position }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "DICE",
    item: { id, value, isRed },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const renderDots = (value) => {
    const dotPositions = {
      1: [[2, 2]],
      2: [
        [1, 1],
        [3, 3],
      ],
      3: [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      4: [
        [1, 1],
        [1, 3],
        [3, 1],
        [3, 3],
      ],
      5: [
        [1, 1],
        [1, 3],
        [2, 2],
        [3, 1],
        [3, 3],
      ],
      6: [
        [1, 1],
        [1, 2],
        [1, 3],
        [3, 1],
        [3, 2],
        [3, 3],
      ],
    };

    return dotPositions[value].map(([row, col], index) => (
      <div
        key={index}
        className="dot"
        style={{
          gridRow: row,
          gridColumn: col,
        }}
      ></div>
    ));
  };

  return (
    <div
      ref={drag}
      className={`dice ${isRed ? "red-dice" : ""} ${
        isRolling ? "rolling" : ""
      }`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        position: "absolute",
        top: position?.top || "0%",
        left: position?.left || "0%",
      }}
    >
      <div className="dots-container">{renderDots(value)}</div>
    </div>
  );
};

export default Dice;
