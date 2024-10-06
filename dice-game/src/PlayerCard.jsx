// PlayerCard.jsx
import React from "react";
import { useDrop } from "react-dnd";
import "./PlayerCard.css";

const PlayerCard = ({
  playerHealth,
  playerCoins,
  buffs,
  collectedBuffs,
  damageAnimation,
  healAnimation,
  selectedPlayer,
  onHealthSlotDrop, // Added back
  onAbilitySlotDrop,
  abilityReady,
  useAbility,
}) => {
  // Health Slot (Accepts red dice to heal)
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

  // Ability Slot
  const [{ isOverAbilitySlot, canDropAbilitySlot }, abilitySlotRef] = useDrop(
    () => ({
      accept: "DICE",
      canDrop: (item) => {
        // Define the dice that can activate the player's ability
        if (selectedPlayer && selectedPlayer.ability) {
          const ability = selectedPlayer.ability;
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
    [selectedPlayer, onAbilitySlotDrop]
  );

  return (
    <div
      className={`player-card ${damageAnimation ? "damage-animation" : ""} ${
        healAnimation ? "heal-animation" : ""
      }`}
    >
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
        src={selectedPlayer.image}
        alt={selectedPlayer.name}
        className="avatar-image"
      />

      {/* Buffs Display */}
      <div className="buffs-display">
        <h4>Buffs:</h4>
        <ul>
          {collectedBuffs.map((buff, index) => (
            <li key={index}>{buff.name}</li>
          ))}
        </ul>
      </div>

      {/* Ability Section */}
      <div className="ability-section">
        <div
          ref={abilitySlotRef}
          className={`ability-slot ${
            isOverAbilitySlot && canDropAbilitySlot ? "hover" : ""
          } ${!canDropAbilitySlot && isOverAbilitySlot ? "invalid" : ""}`}
        >
          {selectedPlayer.ability.slotText}
        </div>
        <button
          className="use-ability-button"
          onClick={useAbility}
          disabled={!abilityReady}
          title={selectedPlayer.ability.description}
        >
          {selectedPlayer.ability.name}
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
