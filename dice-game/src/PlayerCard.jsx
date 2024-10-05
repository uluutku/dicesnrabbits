// PlayerCard.jsx
import React from "react";
import { useDrop } from "react-dnd";
import "./PlayerCard.css";

const PlayerCard = ({
  playerHealth,
  onHealthSlotDrop,
  onDiceChangeSlotDrop,
}) => {
  // Health Slot (Top Left)
  const [{ isOverHealthSlot, canDropHealthSlot }, healthSlotRef] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: (item) => item.isRed, // Accept only red dice
      drop: (item) => {
        onHealthSlotDrop(item.id, item.value);
      },
      collect: (monitor) => ({
        isOverHealthSlot: !!monitor.isOver(),
        canDropHealthSlot: monitor.canDrop(),
      }),
    }),
    [onHealthSlotDrop]
  );

  // Dice Change Slot (Bottom)
  const [{ isOverDiceChangeSlot, canDropDiceChangeSlot }, diceChangeSlotRef] =
    useDrop(
      () => ({
        accept: "DICE",
        canDrop: (item) => item.value === 5, // Accept only dice with value 5
        drop: (item) => {
          onDiceChangeSlotDrop(item.id);
        },
        collect: (monitor) => ({
          isOverDiceChangeSlot: !!monitor.isOver(),
          canDropDiceChangeSlot: monitor.canDrop(),
        }),
      }),
      [onDiceChangeSlotDrop]
    );

  return (
    <div className="player-card">
      {/* Health Slot */}
      <div
        ref={healthSlotRef}
        className={`health-slot ${
          isOverHealthSlot && canDropHealthSlot ? "hover" : ""
        } ${!canDropHealthSlot && isOverHealthSlot ? "invalid" : ""}`}
      >
        HP: {playerHealth}
      </div>

      {/* Avatar Image */}
      <img
        src="/images/rabbit-wizard.png"
        alt="Rabbit Wizard"
        className="avatar-image"
      />

      <div>
        <h1 className="name-text">Rabbit Wizard</h1>
      </div>

      {/* Dice Change Slot */}
      <div
        ref={diceChangeSlotRef}
        className={`dice-change-slot ${
          isOverDiceChangeSlot && canDropDiceChangeSlot ? "hover" : ""
        } ${!canDropDiceChangeSlot && isOverDiceChangeSlot ? "invalid" : ""}`}
      >
        =5
      </div>
    </div>
  );
};

export default PlayerCard;
