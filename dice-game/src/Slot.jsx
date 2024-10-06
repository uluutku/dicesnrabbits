// Slot.jsx
import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import "./Slot.css";

const Slot = ({ slot, enemyId, onDamage, isDead }) => {
  const isClosed = slot.isClosed;
  const [isDamaged, setIsDamaged] = useState(false);
  const [isInvalidDrop, setIsInvalidDrop] = useState(false);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: (item) => {
        if (isDead || isClosed) return false;

        // Check if the dice value meets the slot condition
        let canDropDice = false;
        switch (slot.type) {
          case "number":
            canDropDice = true; // Any dice can be placed
            break;
          case "exact":
            canDropDice = item.value === slot.value;
            break;
          case "higher":
            canDropDice = item.value >= slot.value; // Inclusive
            break;
          case "lower":
            canDropDice = item.value <= slot.value; // Inclusive
            break;
          default:
            break;
        }
        return canDropDice;
      },
      drop: (item) => {
        if (!isDead && !isClosed) {
          onDamage(enemyId, slot, item.id, item.value);
          setIsDamaged(true);
        }
      },
      hover: (item, monitor) => {
        if (!monitor.canDrop()) {
          setIsInvalidDrop(true);
        } else {
          setIsInvalidDrop(false);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [isDead, isClosed, slot]
  );

  useEffect(() => {
    if (isDamaged) {
      const timer = setTimeout(() => setIsDamaged(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isDamaged]);

  useEffect(() => {
    if (isInvalidDrop) {
      const timer = setTimeout(() => setIsInvalidDrop(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isInvalidDrop]);

  const getSlotLabel = () => {
    if (isClosed) {
      return "X";
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
      } ${isClosed ? "closed" : ""} ${isDamaged ? "damaged" : ""} ${
        isInvalidDrop ? "invalid-drop" : ""
      }`}
    >
      {getSlotLabel()}
    </div>
  );
};

export default Slot;
