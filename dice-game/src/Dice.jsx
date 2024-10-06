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

  // Update renderDots to ensure the correct value is used
  const renderDots = (value) => {
    const dotPositions = {
      1: ["center"],
      2: ["top-left", "bottom-right"],
      3: ["top-left", "center", "bottom-right"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
      6: [
        "top-left",
        "top-right",
        "middle-left",
        "middle-right",
        "bottom-left",
        "bottom-right",
      ],
    };

    const positions = dotPositions[value] || [];

    return (
      <div className="dice-dots">
        {positions.map((pos, index) => (
          <div key={index} className={`dot ${pos}`}></div>
        ))}
      </div>
    );
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
