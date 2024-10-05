// Dice.jsx
import React from "react";
import { useDrag } from "react-dnd";
import "./Dice.css";

const Dice = ({ id, value, isRed }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "DICE",
    item: { id, value, isRed },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const renderDots = (value) => {
    const positions = {
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

    return positions[value].map((position, index) => (
      <div key={index} className={`dot ${position}`}></div>
    ));
  };

  return (
    <div
      ref={drag}
      className={`dice ${isRed ? "red-dice" : ""}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {renderDots(value)}
    </div>
  );
};

export default Dice;
