// Dice.jsx
import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import "./Dice.css";

const Dice = ({ id, value }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "DICE",
    item: { id, value },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const [isRolling, setIsRolling] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsRolling(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
      className={`dice ${isRolling ? "rolling" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {!isRolling && renderDots(value)}
    </div>
  );
};

export default Dice;
