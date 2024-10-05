// Slot.jsx
import React from "react";
import { useDrop } from "react-dnd";
import "./Slot.css";

const Slot = ({ slot, enemyId, onDamage, isDead }) => {
  const isClosed = slot.isClosed;

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: (item) => {
        if (isDead || isClosed) return false;

        // Check if the dice value meets the slot condition
        switch (slot.type) {
          case "number":
            return true; // Any dice can be placed
          case "exact":
            return item.value === slot.value;
          case "higher":
            return item.value > slot.value;
          case "lower":
            return item.value < slot.value;
          default:
            return false;
        }
      },
      drop: (item) => {
        if (!isDead && !isClosed) {
          onDamage(enemyId, slot, item.id, item.value);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [isDead, isClosed, slot]
  );

  const getSlotLabel = () => {
    if (isClosed) {
      return "Closed";
    }
    switch (slot.type) {
      case "number":
        return slot.value;
      case "exact":
        return `=${slot.value}`;
      case "higher":
        return `${slot.value}+`;
      case "lower":
        return `${slot.value}-`;
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
