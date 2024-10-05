// App.jsx
import React, { useState } from "react";
import Dice from "./Dice";
import EnemyCard from "./EnemyCard";
import PlayerCard from "./PlayerCard";
import enemyData from "./enemyData";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const Game = () => {
  const [diceValues, setDiceValues] = useState([]);
  const [diceThrown, setDiceThrown] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(50);
  const [enemies, setEnemies] = useState([getRandomEnemy()]);

  // Function to get a random enemy from enemyData
  function getRandomEnemy() {
    const randomIndex = Math.floor(Math.random() * enemyData.length);
    const enemyTemplate = enemyData[randomIndex];
    // Create a copy of the enemy object and assign a unique instance ID
    const enemy = {
      ...enemyTemplate,
      id: uuidv4(),
      // Initialize slots with isClosed property
      slots: enemyTemplate.slots.map((slot) => ({ ...slot, isClosed: false })),
    };
    return enemy;
  }

  const throwDice = () => {
    if (!diceThrown) {
      const value1 = Math.floor(Math.random() * 6) + 1;
      const value2 = Math.floor(Math.random() * 6) + 1;
      setDiceValues([
        { id: uuidv4(), value: value1 },
        { id: uuidv4(), value: value2 },
      ]);
      setDiceThrown(true);
    }
  };

  const handleDamage = (enemyId, slot, diceId, diceValue, setSlotState) => {
    // Remove the used dice
    setDiceValues((prevDiceValues) =>
      prevDiceValues.filter((dice) => dice.id !== diceId)
    );

    // Apply effects based on slot type
    let updatedSlot = { ...slot };
    switch (slot.type) {
      case "number":
        updatedSlot.value -= diceValue;
        if (updatedSlot.value <= 0) {
          updatedSlot.isClosed = true;
        }
        break;
      case "exact":
        updatedSlot.isClosed = true;
        break;
      case "higher":
      case "lower":
        updatedSlot.isClosed = true;
        break;
      default:
        break;
    }

    // Update the slot state
    setSlotState(updatedSlot);

    // Update the enemy's slots in the enemies array
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        if (enemy.id === enemyId) {
          const updatedSlots = enemy.slots.map((s) =>
            s.id === slot.id ? updatedSlot : s
          );
          return { ...enemy, slots: updatedSlots };
        }
        return enemy;
      })
    );
  };

  const endTurn = () => {
    // Calculate enemy attack
    const totalEnemyAttack = enemies
      .filter((enemy) => {
        // Enemy is alive if not all slots are closed
        return !enemy.slots.every((slot) => slot.isClosed);
      })
      .reduce((total, enemy) => total + enemy.attack, 0);

    setPlayerHealth((prevHealth) => prevHealth - totalEnemyAttack);

    // Remove defeated enemies
    const aliveEnemies = enemies.filter((enemy) => {
      return !enemy.slots.every((slot) => slot.isClosed);
    });

    // If all enemies are defeated, spawn a new one
    if (aliveEnemies.length === 0) {
      setEnemies([getRandomEnemy()]);
    } else {
      setEnemies(aliveEnemies);
    }

    setDiceValues([]);
    setDiceThrown(false);
  };

  return (
    <div className="game-container">
      <h1>Dice Battle</h1>
      <div className="player-section">
        <PlayerCard playerHealth={playerHealth} />
        <button
          onClick={throwDice}
          disabled={diceThrown}
          className="action-button"
        >
          Throw Dices
        </button>
      </div>

      <div className="dice-section">
        {diceValues.map((dice) => (
          <Dice key={dice.id} id={dice.id} value={dice.value} />
        ))}
      </div>

      <div className="enemy-section">
        {enemies.map((enemy) => (
          <EnemyCard key={enemy.id} enemy={enemy} onDamage={handleDamage} />
        ))}
      </div>

      <button
        onClick={endTurn}
        disabled={!diceThrown}
        className="action-button"
      >
        End Turn
      </button>

      {playerHealth <= 0 && <h2>Game Over!</h2>}
    </div>
  );
};

export default Game;
