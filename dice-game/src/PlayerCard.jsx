// PlayerCard.jsx
import React from "react";
import { useDrop } from "react-dnd";
import "./PlayerCard.css";

const PlayerCard = ({ playerHealth, onPlayerSlotDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: () => true, // Accept any dice
      drop: (item) => {
        onPlayerSlotDrop(item.id, item.value, item.isRed);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onPlayerSlotDrop]
  );

  return (
    <div className="player-card">
      <h3>Rabbit Wizard</h3>
      <div className="health-bar">
        <div
          className="health-fill"
          style={{ width: `${(playerHealth / 60) * 100}%` }}
        ></div>
      </div>
      <p>{playerHealth} / 60 HP</p>

      {/* Player Slot */}
      <div
        ref={drop}
        className={`player-slot ${isOver && canDrop ? "hover" : ""} ${
          !canDrop && isOver ? "invalid" : ""
        }`}
      >
        =5 / Red Dice
      </div>
    </div>
  );
};

export default PlayerCard;
