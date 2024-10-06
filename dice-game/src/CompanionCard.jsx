// CompanionCard.jsx
import React from "react";
import { useDrop } from "react-dnd";
import "./CompanionCard.css";

const CompanionCard = ({
  companion,
  companionHealth,
  damageAnimation,
  healAnimation,
  onAbilitySlotDrop,
  abilityReady,
  useAbility,
  abilityDice,
}) => {
  // Ability Slot
  const [{ isOverAbilitySlot, canDropAbilitySlot }, abilitySlotRef] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: (item) => {
        // Define the dice that can activate the companion's ability
        if (companion && companion.ability) {
          const ability = companion.ability;
          switch (ability.activationType) {
            case "diceValue":
              return item.value === ability.diceValue;
            case "diceColor":
              return ability.diceColor === "red" && item.isRed;
            default:
              return false;
          }
        }
        return false;
      },
      drop: (item) => {
        onAbilitySlotDrop(item.id, item.value, item.isRed);
      },
      collect: (monitor) => ({
        isOverAbilitySlot: !!monitor.isOver(),
        canDropAbilitySlot: monitor.canDrop(),
      }),
    }),
    [companion, onAbilitySlotDrop]
  );

  return (
    <div
      className={`companion-card ${damageAnimation ? "damage-animation" : ""} ${
        healAnimation ? "heal-animation" : ""
      }`}
    >
      {/* Health Slot */}
      <div className="companion-health-slot">Can: {companionHealth}</div>

      {/* Avatar Image */}
      <img
        src={companion.image}
        alt={companion.name}
        className="companion-avatar-image"
      />

      {/* Companion Name */}
      <div className="companion-name">{companion.name}</div>

      {/* Ability Slot */}
      <div className="companion-ability-section">
        <div
          ref={abilitySlotRef}
          className={`companion-ability-slot ${
            isOverAbilitySlot && canDropAbilitySlot ? "hover" : ""
          } ${!canDropAbilitySlot && isOverAbilitySlot ? "invalid" : ""}`}
        >
          {companion.ability.slotText}
        </div>
        <button
          className="use-ability-button"
          onClick={useAbility}
          disabled={!abilityReady}
          title={companion.ability.description}
        >
          {companion.ability.name}
        </button>
      </div>
    </div>
  );
};

export default CompanionCard;
