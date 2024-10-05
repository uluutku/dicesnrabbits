// Game.jsx
import React, { useState, useEffect } from "react";
import Dice from "./Dice";
import EnemyCard from "./EnemyCard";
import PlayerCard from "./PlayerCard";
import SavedDiceSlot from "./SavedDiceSlot";
import Shop from "./Shop";
import enemyData from "./enemyData";
import { v4 as uuidv4 } from "uuid";
import "./Game.css";

const Game = () => {
  const [diceValues, setDiceValues] = useState([]);
  const [diceThrown, setDiceThrown] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(50);
  const [enemies, setEnemies] = useState([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [showShop, setShowShop] = useState(false);
  const [buffs, setBuffs] = useState({
    extraDice: 0,
    damageReduction: 0,
  });

  const [savedDice, setSavedDice] = useState([null, null, null]); // Fixed array of 3 slots
  const [rollingDice, setRollingDice] = useState([]);

  // Initialize enemies or show shop at the start
  useEffect(() => {
    if (enemies.length === 0 && !showShop) {
      if (currentStage > 30) {
        // Game finished
        // You can add a game completion screen here
      } else if (currentStage % 5 === 0 && currentStage !== 0) {
        // Show shop every 5 stages
        setShowShop(true);
      } else {
        // Start new stage
        startNewStage();
      }
    }
  }, [enemies, showShop, currentStage]);

  const startNewStage = () => {
    let enemyCount = Math.floor(Math.random() * 3) + 1; // Random number between 1 and 3

    // For the final stage, override with the boss enemy
    if (currentStage === 30) {
      enemyCount = 1; // Only one boss
      const bossEnemy = getBossEnemy();
      setEnemies([bossEnemy]);
    } else {
      const newEnemies = [];
      for (let i = 0; i < enemyCount; i++) {
        newEnemies.push(getRandomEnemy());
      }
      setEnemies(newEnemies);
    }
  };

  // Function to get a random enemy from enemyData
  const getRandomEnemy = () => {
    // Determine difficulty based on current stage
    let difficultyLevel;
    if (currentStage <= 3) {
      difficultyLevel = 1; // Easy enemies
    } else if (currentStage <= 20) {
      difficultyLevel = 2; // Medium enemies
    } else {
      difficultyLevel = 3; // Hard enemies
    }

    // Filter enemies based on difficulty
    const availableEnemies = enemyData.filter(
      (enemy) => enemy.difficulty === difficultyLevel
    );

    const randomIndex = Math.floor(Math.random() * availableEnemies.length);
    const enemyTemplate = availableEnemies[randomIndex];

    // Create a copy of the enemy object and assign a unique instance ID
    const enemy = {
      ...enemyTemplate,
      id: uuidv4(),
      // Initialize slots with isClosed property
      slots: enemyTemplate.slots.map((slot) => ({ ...slot, isClosed: false })),
    };
    return enemy;
  };

  const getBossEnemy = () => {
    const bossEnemyData = enemyData.find((enemy) => enemy.difficulty === 4);
    const bossEnemy = {
      ...bossEnemyData,
      id: uuidv4(),
      slots: bossEnemyData.slots.map((slot) => ({ ...slot, isClosed: false })),
    };
    return bossEnemy;
  };

  const throwDice = () => {
    if (!diceThrown) {
      const totalDice = 2 + buffs.extraDice;
      const newDiceValues = [];
      for (let i = 0; i < totalDice; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
        const isRed = Math.random() < 0.1; // 10% chance for red dice
        const position = {
          top: Math.random() * 80 + "%",
          left: Math.random() * 80 + "%",
        };
        newDiceValues.push({ id: uuidv4(), value, isRed, position });
      }
      setRollingDice(newDiceValues);
      setDiceThrown(true);

      // Simulate dice rolling animation
      setTimeout(() => {
        setDiceValues((prevDiceValues) => [
          ...prevDiceValues,
          ...newDiceValues,
        ]);
        setRollingDice([]);
      }, 1000); // Duration of the rolling animation
    }
  };

  const handleSaveDice = (diceId, slotIndex) => {
    setDiceValues((prevDiceValues) => {
      const diceToSave = prevDiceValues.find((dice) => dice.id === diceId);
      if (!diceToSave) return prevDiceValues;
      setSavedDice((prevSavedDice) => {
        const newSavedDice = [...prevSavedDice];
        newSavedDice[slotIndex] = diceToSave;
        return newSavedDice;
      });
      return prevDiceValues.filter((dice) => dice.id !== diceId);
    });
  };

  const retrieveSavedDice = (slotIndex) => {
    const diceToRetrieve = savedDice[slotIndex];
    if (diceToRetrieve) {
      setDiceValues((prevDiceValues) => [...prevDiceValues, diceToRetrieve]);
      setSavedDice((prevSavedDice) => {
        const newSavedDice = [...prevSavedDice];
        newSavedDice[slotIndex] = null;
        return newSavedDice;
      });
    }
  };

  const handleDamage = (enemyId, slot, diceId, diceValue) => {
    // Remove the used dice
    setDiceValues((prevDiceValues) =>
      prevDiceValues.filter((dice) => dice.id !== diceId)
    );
    setSavedDice((prevSavedDice) =>
      prevSavedDice.map((dice) => (dice && dice.id === diceId ? null : dice))
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
        if (diceValue === slot.value) {
          updatedSlot.isClosed = true;
        }
        break;
      case "higher":
        if (diceValue >= slot.value) {
          updatedSlot.isClosed = true;
        }
        break;
      case "lower":
        if (diceValue <= slot.value) {
          updatedSlot.isClosed = true;
        }
        break;
      default:
        break;
    }

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

  // Function to handle dropping a red dice on the health slot
  const onHealthSlotDrop = (diceId, diceValue) => {
    // Remove the used dice
    setDiceValues((prevDiceValues) =>
      prevDiceValues.filter((dice) => dice.id !== diceId)
    );
    setSavedDice((prevSavedDice) =>
      prevSavedDice.map((dice) => (dice && dice.id === diceId ? null : dice))
    );

    // Increase player health by dice value
    setPlayerHealth((prevHealth) => prevHealth + diceValue);
  };

  // Function to handle dropping a dice with value 5 on the dice change slot
  const onDiceChangeSlotDrop = (diceId) => {
    // Remove the used dice
    setDiceValues((prevDiceValues) =>
      prevDiceValues.filter((dice) => dice.id !== diceId)
    );
    setSavedDice((prevSavedDice) =>
      prevSavedDice.map((dice) => (dice && dice.id === diceId ? null : dice))
    );

    // Add two extra dice
    const newDiceValues = [];
    for (let i = 0; i < 2; i++) {
      const value = Math.floor(Math.random() * 6) + 1;
      const isRed = Math.random() < 0.1; // 10% chance for red dice
      const position = {
        top: Math.random() * 80 + "%",
        left: Math.random() * 80 + "%",
      };
      newDiceValues.push({ id: uuidv4(), value, isRed, position });
    }
    setDiceValues((prevDiceValues) => [...prevDiceValues, ...newDiceValues]);
  };

  const endTurn = () => {
    // Automatically save unused dice if there are empty save slots
    setSavedDice((prevSavedDice) => {
      const newSavedDice = [...prevSavedDice];
      let diceToSave = diceValues.slice(); // Copy of remaining dice
      for (let i = 0; i < newSavedDice.length; i++) {
        if (newSavedDice[i] == null && diceToSave.length > 0) {
          newSavedDice[i] = diceToSave.shift();
        }
      }
      // After saving, any remaining dice should be discarded
      setDiceValues([]); // Clear diceValues to remove unsaved dice
      return newSavedDice;
    });

    // Calculate enemy attack
    const totalEnemyAttack = enemies
      .filter((enemy) => {
        // Enemy is alive if not all slots are closed
        return !enemy.slots.every((slot) => slot.isClosed);
      })
      .reduce((total, enemy) => total + enemy.attack, 0);

    const damageTaken = Math.max(totalEnemyAttack - buffs.damageReduction, 0);

    setPlayerHealth((prevHealth) => prevHealth - damageTaken);

    // Remove defeated enemies
    const aliveEnemies = enemies.filter((enemy) => {
      return !enemy.slots.every((slot) => slot.isClosed);
    });

    // If all enemies are defeated, increment the stage
    if (aliveEnemies.length === 0) {
      setCurrentStage((prevStage) => prevStage + 1);
      setEnemies([]); // Clear enemies to trigger useEffect
      setDiceThrown(false);
      // Dice are already cleared above
    } else {
      setEnemies(aliveEnemies);
      setDiceThrown(false);
      // Dice are already cleared above
    }
  };

  const handleBuffSelection = (selectedBuff) => {
    // Apply the selected buff
    switch (selectedBuff.type) {
      case "extraDice":
        setBuffs((prevBuffs) => ({
          ...prevBuffs,
          extraDice: prevBuffs.extraDice + 1,
        }));
        break;
      case "heal":
        setPlayerHealth((prevHealth) => prevHealth + selectedBuff.amount);
        break;
      case "damageReduction":
        setBuffs((prevBuffs) => ({
          ...prevBuffs,
          damageReduction: prevBuffs.damageReduction + selectedBuff.amount,
        }));
        break;
      default:
        break;
    }

    // Close the shop and start the next stage
    setShowShop(false);
    startNewStage();
  };

  if (showShop) {
    return (
      <div className="game-container">
        <Shop onSelectBuff={handleBuffSelection} />
      </div>
    );
  }

  if (currentStage > 30) {
    return (
      <div className="game-container">
        <h1>Congratulations!</h1>
        <p>You have completed all stages!</p>
      </div>
    );
  }

  if (playerHealth <= 0) {
    return (
      <div className="game-container">
        <h1>Game Over!</h1>
        <p>You reached stage {currentStage}</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      <p className="stage-info">Stage: {currentStage}</p>

      <div className="enemy-section">
        {enemies.map((enemy) => (
          <EnemyCard key={enemy.id} enemy={enemy} onDamage={handleDamage} />
        ))}
      </div>

      <div className="dice-section">
        {rollingDice.map((dice) => (
          <Dice
            key={dice.id}
            id={dice.id}
            value={dice.value}
            isRed={dice.isRed}
            isRolling={true}
            position={dice.position}
          />
        ))}
        {diceValues.map((dice) => (
          <Dice
            key={dice.id}
            id={dice.id}
            value={dice.value}
            isRed={dice.isRed}
            position={dice.position}
          />
        ))}
      </div>

      <div className="player-section">
        <PlayerCard
          playerHealth={playerHealth}
          onHealthSlotDrop={onHealthSlotDrop}
          onDiceChangeSlotDrop={onDiceChangeSlotDrop}
        />
        <button
          onClick={throwDice}
          disabled={diceThrown}
          className="action-button"
        >
          Throw Dices
        </button>
      </div>

      <div className="end-turn-button">
        <button
          onClick={endTurn}
          disabled={!diceThrown}
          className="action-button"
        >
          End Turn
        </button>
      </div>

      {/* Dice Storage Slots */}
      <div className="dice-storage">
        {savedDice.map((dice, index) => (
          <SavedDiceSlot
            key={index}
            savedDice={dice}
            onSaveDice={(diceId) => handleSaveDice(diceId, index)}
            onRetrieveDice={() => retrieveSavedDice(index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
