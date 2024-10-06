import React from "react";
import { useDrop } from "react-dnd";
import "./CompanionCard.css";

const CompanionCard = ({
  companion,
  companionHealth,
  damageAnimation,
  healAnimation,
  onHealthSlotDrop, // New prop for handling health dice drop
  onAbilitySlotDrop,
  abilityReady,
  useAbility,
  abilityDice,
}) => {
  // Health Slot (Accepts red dice to heal companion)
  const [{ isOverHealthSlot, canDropHealthSlot }, healthSlotRef] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: (item) => item.isRed, // Only red dice can heal
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

  // Ability Slot
  const [{ isOverAbilitySlot, canDropAbilitySlot }, abilitySlotRef] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: (item) => {
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
      <div
        ref={healthSlotRef}
        className={`companion-health-slot ${
          isOverHealthSlot && canDropHealthSlot ? "hover" : ""
        } ${!canDropHealthSlot && isOverHealthSlot ? "invalid" : ""}`}
      >
        HP: {companionHealth}
      </div>

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
