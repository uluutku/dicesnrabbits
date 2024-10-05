// Slot.jsx
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "./Slot.css";

const Slot = ({ slot, enemyId, onDamage, isDead }) => {
  const [slotState, setSlotState] = useState(slot);
  const isClosed = slotState.isClosed;

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: (item) => {
        if (isDead || isClosed) return false;

        // Check if the dice value meets the slot condition
        switch (slotState.type) {
          case "number":
            return true; // Any dice can be placed
          case "exact":
            return item.value === slotState.value;
          case "higher":
            return item.value > slotState.value;
          case "lower":
            return item.value < slotState.value;
          default:
            return false;
        }
      },
      drop: (item) => {
        if (!isDead && !isClosed) {
          onDamage(enemyId, slotState, item.id, item.value, setSlotState);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [isDead, isClosed, slotState]
  );

  const getSlotLabel = () => {
    if (isClosed) {
      return "Closed";
    }
    switch (slotState.type) {
      case "number":
        return slotState.value;
      case "exact":
        return `=${slotState.value}`;
      case "higher":
        return `${slotState.value}+`;
      case "lower":
        return `${slotState.value}-`;
      default:
        return "";
    }
  };

  return (
    <div
      ref={drop}
      className={`slot ${isOver && canDrop ? "hover" : ""} ${
        !canDrop && isOver ? "invalid" : ""
      } ${isClosed ? "closed" : ""}`}
    >
      {getSlotLabel()}
    </div>
  );
};

export default Slot;
