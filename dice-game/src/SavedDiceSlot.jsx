// SavedDiceSlot.jsx
import React from "react";
import { useDrop } from "react-dnd";
import Dice from "./Dice";
import "./SavedDiceSlot.css";

const SavedDiceSlot = ({ savedDice, onSaveDice, onRetrieveDice }) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: () => savedDice == null,
      drop: (item) => {
        onSaveDice(item.id);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [savedDice]
  );

  return (
    <div
      ref={drop}
      className={`saved-dice-slot ${isOver && canDrop ? "hover" : ""} ${
        !canDrop && isOver ? "invalid" : ""
      }`}
      onClick={() => {
        if (savedDice) {
          onRetrieveDice();
        }
      }}
    >
      {savedDice ? (
        <Dice
          id={savedDice.id}
          value={savedDice.value}
          isRed={savedDice.isRed}
          position={{ top: "0%", left: "0%" }}
        />
      ) : (
        "Save Dice"
      )}
    </div>
  );
};

export default SavedDiceSlot;
