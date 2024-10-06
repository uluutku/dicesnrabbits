// Game.jsx
import React, { useState, useEffect } from "react";
import Dice from "./Dice";
import EnemyCard from "./EnemyCard";
import PlayerCard from "./PlayerCard";
import CompanionCard from "./CompanionCard";
import SavedDiceSlot from "./SavedDiceSlot";
import Shop from "./Shop";
import CompanionShop from "./CompanionShop";
import enemyData from "./enemyData";
import companionData from "./companionData";
import playerData from "./playerData"; // Import player character data
import { v4 as uuidv4 } from "uuid";
import "./Game.css";

const Game = () => {
  // State variables
  const [diceValues, setDiceValues] = useState([]);
  const [diceThrown, setDiceThrown] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(50);
  const [playerCoins, setPlayerCoins] = useState(0);
  const [buffs, setBuffs] = useState({
    extraDice: 0,
    damageReduction: 0,
  });
  const [collectedBuffs, setCollectedBuffs] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [showShop, setShowShop] = useState(false);
  const [showCompanionShop, setShowCompanionShop] = useState(false);
  const [companion, setCompanion] = useState(null);
  const [companionHealth, setCompanionHealth] = useState(30);

  const [savedDice, setSavedDice] = useState([null, null, null]); // Fixed array of 3 slots
  const [rollingDice, setRollingDice] = useState([]);

  // Game status: 'start', 'playing', 'gameOver', 'gameWon'
  const [gameStatus, setGameStatus] = useState("start");

  // Animation state variables
  const [playerDamageAnimation, setPlayerDamageAnimation] = useState(false);
  const [playerHealAnimation, setPlayerHealAnimation] = useState(false);
  const [companionDamageAnimation, setCompanionDamageAnimation] =
    useState(false);
  const [companionHealAnimation, setCompanionHealAnimation] = useState(false);
  const [coinAnimation, setCoinAnimation] = useState(false);

  // Ability activation states
  const [playerAbilityReady, setPlayerAbilityReady] = useState(false);
  const [companionAbilityReady, setCompanionAbilityReady] = useState(false);

  // Dice in ability slots
  const [playerAbilityDice, setPlayerAbilityDice] = useState(null);
  const [companionAbilityDice, setCompanionAbilityDice] = useState(null);

  // Selected player character
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Initialize enemies or show shop at the start
  useEffect(() => {
    if (
      gameStatus === "playing" &&
      enemies.length === 0 &&
      !showShop &&
      !showCompanionShop
    ) {
      if (currentStage > 30) {
        // Game won
        setGameStatus("gameWon");
      } else if (currentStage % 5 === 0 && currentStage !== 0) {
        // Show shop every 5 stages
        setShowShop(true);
      } else {
        // Start new stage
        startNewStage();
      }
    }
  }, [enemies, showShop, showCompanionShop, currentStage, gameStatus]);

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

  const getRandomEnemy = () => {
    // Determine difficulty based on current stage
    let difficultyLevel;
    if (currentStage <= 10) {
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
      const minimumDistance = 20; // Minimum distance between dice in percentage

      const generateRandomPosition = (existingPositions) => {
        let position;
        let isOverlapping;
        do {
          position = {
            top: Math.random() * 60 + "%",
            left: Math.random() * 60 + "%",
          };
          isOverlapping = existingPositions.some((pos) => {
            const topDifference = Math.abs(
              parseFloat(pos.top) - parseFloat(position.top)
            );
            const leftDifference = Math.abs(
              parseFloat(pos.left) - parseFloat(position.left)
            );
            return (
              topDifference < minimumDistance &&
              leftDifference < minimumDistance
            );
          });
        } while (isOverlapping);
        return position;
      };

      for (let i = 0; i < totalDice; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
        const isRed = Math.random() < 0.15; // 15% chance for red dice
        const position = generateRandomPosition(
          newDiceValues.map((dice) => dice.position)
        );
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
      }, 1000);
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

  const handleDamage = (enemyId, slot, diceId, diceValue, diceIsRed) => {
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

  // Function to handle dropping a dice on the player's ability slot
  const onPlayerAbilitySlotDrop = (diceId, diceValue, isRed) => {
    if (!selectedPlayer || !selectedPlayer.ability) return;

    // Remove the used dice from diceValues
    setDiceValues((prevDiceValues) =>
      prevDiceValues.filter((dice) => dice.id !== diceId)
    );

    // Remove from saved dice if present
    setSavedDice((prevSavedDice) =>
      prevSavedDice.map((dice) => (dice && dice.id === diceId ? null : dice))
    );

    // Place the dice in the player's ability slot
    setPlayerAbilityDice({ id: diceId, value: diceValue, isRed });

    // Enable the ability button
    setPlayerAbilityReady(true);
  };

  // Function to handle using the player's ability
  const usePlayerAbility = () => {
    if (!playerAbilityReady || !selectedPlayer || !selectedPlayer.ability)
      return;

    const ability = selectedPlayer.ability;

    // Activate ability based on type
    switch (ability.type) {
      case "extraDice":
        // Add extra dice
        const newDiceValues = [];
        for (let i = 0; i < ability.amount; i++) {
          const value = Math.floor(Math.random() * 6) + 1;
          const isRed = Math.random() < 0.15; // 15% chance for red dice
          const position = {
            top: Math.random() * 80 + "%",
            left: Math.random() * 80 + "%",
          };
          newDiceValues.push({ id: uuidv4(), value, isRed, position });
        }
        setDiceValues((prevDiceValues) => [
          ...prevDiceValues,
          ...newDiceValues,
        ]);
        break;
      case "healPlayer":
        // Heal the player
        setPlayerHealth((prevHealth) => prevHealth + ability.amount);
        setPlayerHealAnimation(true); // Trigger heal animation
        break;
      case "attackEnemy":
        // Damage all enemies by a certain amount
        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => ({
            ...enemy,
            slots: enemy.slots.map((slot) => {
              if (!slot.isClosed) {
                let newValue = slot.value - ability.amount;
                return {
                  ...slot,
                  value: newValue,
                  isClosed: newValue <= 0 ? true : slot.isClosed,
                };
              }
              return slot;
            }),
          }))
        );
        break;

      default:
        break;
    }

    // Consume the dice
    setPlayerAbilityDice(null);
    setPlayerAbilityReady(false);
  };

  // Function to handle dropping a dice on the companion's ability slot
  const onCompanionAbilitySlotDrop = (diceId, diceValue, isRed) => {
    if (!companion || !companion.ability) return;

    // Remove the used dice
    setDiceValues((prevDiceValues) =>
      prevDiceValues.filter((dice) => dice.id !== diceId)
    );

    // Remove from saved dice if present
    setSavedDice((prevSavedDice) =>
      prevSavedDice.map((dice) => (dice && dice.id === diceId ? null : dice))
    );

    // Place the dice in the companion's ability slot
    setCompanionAbilityDice({ id: diceId, value: diceValue, isRed });

    // Enable the ability button
    setCompanionAbilityReady(true);
  };

  // Function to handle using the companion's ability
  const useCompanionAbility = () => {
    if (!companionAbilityReady || !companion || !companion.ability) return;

    const ability = companion.ability;

    // Activate ability based on type
    switch (ability.type) {
      case "healPlayer":
        setPlayerHealth((prevHealth) => prevHealth + ability.amount);
        setPlayerHealAnimation(true); // Trigger heal animation
        break;
      case "attackEnemy":
        // Damage all enemies by a certain amount
        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => ({
            ...enemy,
            slots: enemy.slots.map((slot) => {
              if (!slot.isClosed) {
                let newValue = slot.value - ability.amount;
                return {
                  ...slot,
                  value: newValue,
                  isClosed: newValue <= 0 ? true : slot.isClosed,
                };
              }
              return slot;
            }),
          }))
        );
        break;
      case "healCompanion":
        setCompanionHealth((prevHealth) => prevHealth + ability.amount);
        setCompanionHealAnimation(true); // Trigger heal animation
        break;
      case "dut":
        alert("Düt!");
        break;
      default:
        break;
    }

    // Consume the dice
    setCompanionAbilityDice(null);
    setCompanionAbilityReady(false);
  };

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
    setPlayerHealAnimation(true); // Trigger heal animation
  };

  const onCompanionHealthSlotDrop = (diceId, diceValue) => {
    // Remove the used dice
    setDiceValues((prevDiceValues) =>
      prevDiceValues.filter((dice) => dice.id !== diceId)
    );
    setSavedDice((prevSavedDice) =>
      prevSavedDice.map((dice) => (dice && dice.id === diceId ? null : dice))
    );

    // Increase companion health by dice value
    setCompanionHealth((prevHealth) => prevHealth + diceValue);
    setCompanionHealAnimation(true); // Trigger heal animation
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

    // Calculate enemy attacks
    const aliveEnemies = enemies.filter((enemy) => {
      // Enemy is alive if not all slots are closed
      return !enemy.slots.every((slot) => slot.isClosed);
    });

    // Initialize total coins earned this turn
    let totalCoinsEarned = 0;

    // Process each enemy's attack
    aliveEnemies.forEach((enemy) => {
      // Randomly select target: player or companion
      const target = Math.random() < 0.5 ? "player" : "companion";

      // Enemy's attack value, considering player's damage reduction buffs
      const damage = Math.max(enemy.attack - buffs.damageReduction, 0);

      if (target === "companion" && companion) {
        // Attack the companion
        setCompanionHealth((prevHealth) => {
          const newHealth = prevHealth - damage;
          if (damage > 0) {
            setCompanionDamageAnimation(true);
          }
          if (newHealth <= 0) {
            // Companion is defeated
            setCompanion(null);
            setCompanionHealth(30); // Reset companion health for next time
          }
          return Math.max(newHealth, 0);
        });
      } else {
        // Attack the player
        setPlayerHealth((prevHealth) => {
          if (damage > 0) {
            setPlayerDamageAnimation(true);
          }
          return prevHealth - damage;
        });
      }
    });

    // Remove defeated enemies and collect coins
    const survivingEnemies = [];
    enemies.forEach((enemy) => {
      const isDefeated = enemy.slots.every((slot) => slot.isClosed);
      if (isDefeated) {
        totalCoinsEarned += enemy.coinDrop || 0; // Ensure coinDrop is a number
        // Trigger coin animation
        setCoinAnimation(true);
      } else {
        survivingEnemies.push(enemy);
      }
    });

    // Add earned coins to player's total coins
    if (totalCoinsEarned > 0) {
      setPlayerCoins((prevCoins) => prevCoins + totalCoinsEarned);
    }

    // Update the enemies state
    if (survivingEnemies.length === 0) {
      setCurrentStage((prevStage) => prevStage + 1);
      setEnemies([]); // Clear enemies to trigger useEffect
      setDiceThrown(false);
    } else {
      setEnemies(survivingEnemies);
      setDiceThrown(false);
    }
  };

  // Reset animations after they finish
  useEffect(() => {
    if (playerDamageAnimation) {
      const timer = setTimeout(() => setPlayerDamageAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [playerDamageAnimation]);

  useEffect(() => {
    if (companionDamageAnimation) {
      const timer = setTimeout(() => setCompanionDamageAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [companionDamageAnimation]);

  useEffect(() => {
    if (playerHealAnimation) {
      const timer = setTimeout(() => setPlayerHealAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [playerHealAnimation]);

  useEffect(() => {
    if (companionHealAnimation) {
      const timer = setTimeout(() => setCompanionHealAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [companionHealAnimation]);

  useEffect(() => {
    if (coinAnimation) {
      const timer = setTimeout(() => setCoinAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [coinAnimation]);

  // Handle game over and game won conditions
  useEffect(() => {
    if (playerHealth <= 0) {
      setGameStatus("gameOver");
    } else if (currentStage > 30) {
      setGameStatus("gameWon");
    }
  }, [playerHealth, currentStage]);

  const handleBuffSelection = (selectedBuff) => {
    // Check if the player has enough coins
    if (playerCoins >= selectedBuff.cost) {
      // Deduct the cost
      setPlayerCoins((prevCoins) => prevCoins - selectedBuff.cost);

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
          setPlayerHealAnimation(true);
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

      // Add the buff to collected buffs for display
      setCollectedBuffs((prevBuffs) => [...prevBuffs, selectedBuff]);

      // Close the shop and open the companion shop
      setShowShop(false);
      setShowCompanionShop(true);
    } else {
      alert("Yeterli coin yok!");
    }
  };

  const handleCompanionSelection = (selectedCompanion) => {
    // Check if the player has enough coins
    if (playerCoins >= selectedCompanion.cost) {
      // Deduct the cost
      setPlayerCoins((prevCoins) => prevCoins - selectedCompanion.cost);

      // Set the new companion
      setCompanion(selectedCompanion);
      setCompanionHealth(30); // Reset companion health

      // Close the companion shop and start the next stage
      setShowCompanionShop(false);
      startNewStage();
    } else {
      alert("Yeterli coin yok!");
    }
  };

  const getDifficultyLabel = () => {
    if (currentStage <= 10) {
      return "Easy";
    } else if (currentStage <= 20) {
      return "Medium";
    } else if (currentStage <= 29) {
      return "Hard";
    } else if (currentStage === 30) {
      return "Boss";
    } else {
      return "";
    }
  };

  const startGame = () => {
    // Reset all game state variables
    setDiceValues([]);
    setDiceThrown(false);
    setPlayerHealth(selectedPlayer.health);
    setPlayerCoins(0);
    setBuffs({
      extraDice: 0,
      damageReduction: 0,
    });
    setCollectedBuffs([]);
    setEnemies([]);
    setCurrentStage(1);
    setShowShop(false);
    setShowCompanionShop(false);
    setCompanion(null);
    setCompanionHealth(30);
    setSavedDice([null, null, null]);
    setRollingDice([]);
    setGameStatus("playing");
  };

  // Handle player character selection
  const selectPlayerCharacter = (player) => {
    setSelectedPlayer(player);
    setPlayerHealth(player.health);
  };

  if (showShop) {
    return (
      <div className="game-container">
        {/* Coin Status at the top right */}
        <div className="coin-status">
          <img src="/images/coin_icon.png" alt="Coins" className="coin-icon" />
          <span>{playerCoins}</span>
        </div>
        <Shop onSelectBuff={handleBuffSelection} playerCoins={playerCoins} />
      </div>
    );
  }

  if (showCompanionShop) {
    return (
      <div className="game-container">
        {/* Coin Status at the top right */}
        <div className="coin-status">
          <img src="/images/coin_icon.png" alt="Coins" className="coin-icon" />
          <span>{playerCoins}</span>
        </div>
        <CompanionShop
          onSelectCompanion={handleCompanionSelection}
          playerCoins={playerCoins}
        />
      </div>
    );
  }

  return (
    <div className="game-container">
      {gameStatus === "start" && (
        <div className="start-screen">
          <h1>Dices & Rabbits</h1>
          <h2>Karakterini Seç</h2>
          <div className="character-selection">
            {playerData.map((player) => (
              <div
                key={player.id}
                className={`character-card ${
                  selectedPlayer && selectedPlayer.id === player.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => selectPlayerCharacter(player)}
              >
                <img
                  src={player.image}
                  alt={player.name}
                  className="character-image"
                />
                <h3>{player.name}</h3>
                <p>{player.description}</p>
                <p>Can: {player.health}</p>
                <p>Yetenek: {player.ability.name}</p>
              </div>
            ))}
          </div>
          {selectedPlayer && (
            <button onClick={startGame} className="start-button">
              Oyuna Başla
            </button>
          )}
        </div>
      )}

      {gameStatus === "playing" && (
        <>
          {/* Coin Status at the top right */}
          <div className="coin-status">
            <span> 🪙 {playerCoins}</span>
          </div>

          <p className="stage-info">Bölüm: {currentStage}</p>

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

          <div className="player-companion-section">
            <div className="player-companion-cards">
              <PlayerCard
                playerHealth={playerHealth}
                playerCoins={playerCoins}
                buffs={buffs}
                collectedBuffs={collectedBuffs}
                damageAnimation={playerDamageAnimation}
                healAnimation={playerHealAnimation}
                selectedPlayer={selectedPlayer}
                onAbilitySlotDrop={onPlayerAbilitySlotDrop}
                abilityReady={playerAbilityReady}
                useAbility={usePlayerAbility}
                abilityDice={playerAbilityDice}
                onHealthSlotDrop={onHealthSlotDrop} // Added this prop
              />
              {companion && (
                <CompanionCard
                  companion={companion}
                  companionHealth={companionHealth}
                  damageAnimation={companionDamageAnimation}
                  healAnimation={companionHealAnimation}
                  onAbilitySlotDrop={onCompanionAbilitySlotDrop}
                  onHealthSlotDrop={onCompanionHealthSlotDrop}
                  abilityReady={companionAbilityReady}
                  useAbility={useCompanionAbility}
                  abilityDice={companionAbilityDice}
                />
              )}
            </div>
            <button
              onClick={throwDice}
              disabled={diceThrown}
              className="action-button"
            >
              Zar At
            </button>
          </div>

          <div className="end-turn-button">
            <button
              onClick={endTurn}
              disabled={!diceThrown}
              className="action-button"
            >
              Eli Bitir
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

          {/* Coin Animation */}
          {coinAnimation && (
            <div className="coin-animation">
              <span>🪙</span>
            </div>
          )}
        </>
      )}

      {gameStatus === "gameOver" && (
        <div className="end-screen">
          <h1>Oyun bitti</h1>
          <p>{currentStage} bölümüne kadar ilerledin.</p>
          <button
            onClick={() => setGameStatus("start")}
            className="restart-button"
          >
            Yeniden Başla
          </button>
        </div>
      )}

      {gameStatus === "gameWon" && (
        <div className="end-screen">
          <h1>Tebrikler!</h1>
          <p>Tüm bölümleri tamamladın!</p>
          <button
            onClick={() => setGameStatus("start")}
            className="restart-button"
          >
            Yeniden Başla
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
