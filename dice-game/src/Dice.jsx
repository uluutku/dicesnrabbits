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

  // Render 2D dots (top face view)
  const render2DDots = (val) => {
    const dotPositions = {
      1: ["center"],
      2: ["top-left", "bottom-right"],
      3: ["top-left", "center", "bottom-right"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
      6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
    };
    const positions = dotPositions[val] || [];
    return (
      <div className="dice-dots">
        {positions.map((pos, index) => (
          <div key={index} className={`dot ${pos}`}></div>
        ))}
      </div>
    );
  };

  // Render a cube face for the 3D animation
  const renderCubeFace = (num) => {
    return (
      <div className="face-content">
        {render2DDots(num)}
      </div>
    );
  };

  return (
    <div
      ref={drag}
      className={`dice-container ${isRed ? "red-dice" : ""} ${isRolling ? "rolling" : ""}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        position: "absolute",
        top: position?.top || "0%",
        left: position?.left || "0%",
      }}
    >
      {isRolling ? (
        <div className="cube">
          <div className="face face1">{renderCubeFace(1)}</div>
          <div className="face face2">{renderCubeFace(2)}</div>
          <div className="face face3">{renderCubeFace(3)}</div>
          <div className="face face4">{renderCubeFace(4)}</div>
          <div className="face face5">{renderCubeFace(5)}</div>
          <div className="face face6">{renderCubeFace(6)}</div>
        </div>
      ) : (
        <div className="flat-dice">
          {render2DDots(value)}
        </div>
      )}
    </div>
  );
};

export default Dice;
