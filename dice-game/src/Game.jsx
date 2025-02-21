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
import { FaMobileAlt } from "react-icons/fa";

const Game = () => {
  // State variables
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
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
  const [gameStatus, setGameStatus] = useState("start");

  // Animation states
  const [playerDamageAnimation, setPlayerDamageAnimation] = useState(false);
  const [playerHealAnimation, setPlayerHealAnimation] = useState(false);
  const [companionDamageAnimation, setCompanionDamageAnimation] = useState(false);
  const [companionHealAnimation, setCompanionHealAnimation] = useState(false);
  const [coinAnimation, setCoinAnimation] = useState(false);

  // Ability activation states
  const [playerAbilityReady, setPlayerAbilityReady] = useState(false);
  const [companionAbilityReady, setCompanionAbilityReady] = useState(false);
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
        setGameStatus("gameWon");
      } else if (currentStage % 5 === 0 && currentStage !== 0) {
        setShowShop(true);
      } else {
        startNewStage();
      }
    }
  }, [enemies, showShop, showCompanionShop, currentStage, gameStatus]);

  const startNewStage = () => {
    let enemyCount = Math.floor(Math.random() * 3) + 1;
    if (currentStage === 30) {
      enemyCount = 1;
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
    let difficultyLevel;
    if (currentStage <= 10) difficultyLevel = 1;
    else if (currentStage <= 20) difficultyLevel = 2;
    else difficultyLevel = 3;
    const availableEnemies = enemyData.filter(
      (enemy) => enemy.difficulty === difficultyLevel
    );
    const randomIndex = Math.floor(Math.random() * availableEnemies.length);
    const enemyTemplate = availableEnemies[randomIndex];
    const enemy = {
      ...enemyTemplate,
      id: uuidv4(),
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
      const minimumDistance = 20;
      const generateRandomPosition = (existingPositions) => {
        let position;
        let isOverlapping;
        do {
          position = {
            top: Math.random() * 60 + "%",
            left: Math.random() * 60 + "%",
          };
          isOverlapping = existingPositions.some((pos) => {
            const topDiff = Math.abs(parseFloat(pos.top) - parseFloat(position.top));
            const leftDiff = Math.abs(parseFloat(pos.left) - parseFloat(position.left));
            return topDiff < minimumDistance && leftDiff < minimumDistance;
          });
        } while (isOverlapping);
        return position;
      };

      for (let i = 0; i < totalDice; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
        const isRed = Math.random() < 0.15;
        const position = generateRandomPosition(newDiceValues.map(dice => dice.position));
        newDiceValues.push({ id: uuidv4(), value, isRed, position });
      }

      setRollingDice(newDiceValues);
      setDiceThrown(true);

      setTimeout(() => {
        setDiceValues((prev) => [...prev, ...newDiceValues]);
        setRollingDice([]);
      }, 1000);
    }
  };

  const handleSaveDice = (diceId, slotIndex) => {
    setDiceValues((prev) => {
      const diceToSave = prev.find((dice) => dice.id === diceId);
      if (!diceToSave) return prev;
      setSavedDice((prevSaved) => {
        const newSaved = [...prevSaved];
        newSaved[slotIndex] = diceToSave;
        return newSaved;
      });
      return prev.filter((dice) => dice.id !== diceId);
    });
  };

  const retrieveSavedDice = (slotIndex) => {
    const diceToRetrieve = savedDice[slotIndex];
    if (diceToRetrieve) {
      setDiceValues((prev) => [...prev, diceToRetrieve]);
      setSavedDice((prev) => {
        const newSaved = [...prev];
        newSaved[slotIndex] = null;
        return newSaved;
      });
    }
  };

  const handleDamage = (enemyId, slot, diceId, diceValue, diceIsRed) => {
    setDiceValues((prev) => prev.filter((dice) => dice.id !== diceId));
    setSavedDice((prev) =>
      prev.map((dice) => (dice && dice.id === diceId ? null : dice))
    );
    let updatedSlot = { ...slot };
    switch (slot.type) {
      case "number":
        updatedSlot.value -= diceValue;
        if (updatedSlot.value <= 0) updatedSlot.isClosed = true;
        break;
      case "exact":
        if (diceValue === slot.value) updatedSlot.isClosed = true;
        break;
      case "higher":
        if (diceValue >= slot.value) updatedSlot.isClosed = true;
        break;
      case "lower":
        if (diceValue <= slot.value) updatedSlot.isClosed = true;
        break;
      default:
        break;
    }
    setEnemies((prev) =>
      prev.map((enemy) => {
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

  const onPlayerAbilitySlotDrop = (diceId, diceValue, isRed) => {
    if (!selectedPlayer || !selectedPlayer.ability) return;
    setDiceValues((prev) => prev.filter((dice) => dice.id !== diceId));
    setSavedDice((prev) =>
      prev.map((dice) => (dice && dice.id === diceId ? null : dice))
    );
    setPlayerAbilityDice({ id: diceId, value: diceValue, isRed });
    setPlayerAbilityReady(true);
  };

  const usePlayerAbility = () => {
    if (!playerAbilityReady || !selectedPlayer || !selectedPlayer.ability) return;
    const ability = selectedPlayer.ability;
    switch (ability.type) {
      case "extraDice":
        const newDiceValues = [];
        for (let i = 0; i < ability.amount; i++) {
          const value = Math.floor(Math.random() * 6) + 1;
          const isRed = Math.random() < 0.15;
          const position = {
            top: Math.random() * 80 + "%",
            left: Math.random() * 80 + "%",
          };
          newDiceValues.push({ id: uuidv4(), value, isRed, position });
        }
        setDiceValues((prev) => [...prev, ...newDiceValues]);
        break;
      case "healPlayer":
        setPlayerHealth((prev) => prev + ability.amount);
        setPlayerHealAnimation(true);
        break;
      case "attackEnemy":
        setEnemies((prev) =>
          prev.map((enemy) => ({
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
    setPlayerAbilityDice(null);
    setPlayerAbilityReady(false);
  };

  const onCompanionAbilitySlotDrop = (diceId, diceValue, isRed) => {
    if (!companion || !companion.ability) return;
    setDiceValues((prev) => prev.filter((dice) => dice.id !== diceId));
    setSavedDice((prev) =>
      prev.map((dice) => (dice && dice.id === diceId ? null : dice))
    );
    setCompanionAbilityDice({ id: diceId, value: diceValue, isRed });
    setCompanionAbilityReady(true);
  };

  const useCompanionAbility = () => {
    if (!companionAbilityReady || !companion || !companion.ability) return;
    const ability = companion.ability;
    switch (ability.type) {
      case "healPlayer":
        setPlayerHealth((prev) => prev + ability.amount);
        setPlayerHealAnimation(true);
        break;
      case "attackEnemy":
        setEnemies((prev) =>
          prev.map((enemy) => ({
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
        setCompanionHealth((prev) => prev + ability.amount);
        setCompanionHealAnimation(true);
        break;
      case "dut":
        alert("Düt!");
        break;
      default:
        break;
    }
    setCompanionAbilityDice(null);
    setCompanionAbilityReady(false);
  };

  const onHealthSlotDrop = (diceId, diceValue) => {
    setDiceValues((prev) => prev.filter((dice) => dice.id !== diceId));
    setSavedDice((prev) =>
      prev.map((dice) => (dice && dice.id === diceId ? null : dice))
    );
    setPlayerHealth((prev) => prev + diceValue);
    setPlayerHealAnimation(true);
  };

  const onCompanionHealthSlotDrop = (diceId, diceValue) => {
    setDiceValues((prev) => prev.filter((dice) => dice.id !== diceId));
    setSavedDice((prev) =>
      prev.map((dice) => (dice && dice.id === diceId ? null : dice))
    );
    setCompanionHealth((prev) => prev + diceValue);
    setCompanionHealAnimation(true);
  };

  const endTurn = () => {
    setSavedDice((prev) => {
      const newSaved = [...prev];
      let diceToSave = diceValues.slice();
      for (let i = 0; i < newSaved.length; i++) {
        if (newSaved[i] == null && diceToSave.length > 0) {
          newSaved[i] = diceToSave.shift();
        }
      }
      setDiceValues([]);
      return newSaved;
    });

    let totalCoinsEarned = 0;
    const aliveEnemies = enemies.filter(
      (enemy) => !enemy.slots.every((slot) => slot.isClosed)
    );

    aliveEnemies.forEach((enemy) => {
      const target = Math.random() < 0.5 ? "player" : "companion";
      const damage = Math.max(enemy.attack - buffs.damageReduction, 0);
      if (target === "companion" && companion) {
        setCompanionHealth((prev) => {
          const newHealth = prev - damage;
          if (damage > 0) setCompanionDamageAnimation(true);
          if (newHealth <= 0) {
            setCompanion(null);
            setCompanionHealth(30);
          }
          return Math.max(newHealth, 0);
        });
      } else {
        setPlayerHealth((prev) => {
          if (damage > 0) setPlayerDamageAnimation(true);
          return prev - damage;
        });
      }
    });

    const survivingEnemies = [];
    enemies.forEach((enemy) => {
      const isDefeated = enemy.slots.every((slot) => slot.isClosed);
      if (isDefeated) {
        totalCoinsEarned += enemy.coinDrop || 0;
        setCoinAnimation(true);
      } else {
        survivingEnemies.push(enemy);
      }
    });

    if (totalCoinsEarned > 0) {
      setPlayerCoins((prev) => prev + totalCoinsEarned);
    }

    if (survivingEnemies.length === 0) {
      setCurrentStage((prev) => prev + 1);
      setEnemies([]);
      setDiceThrown(false);
    } else {
      setEnemies(survivingEnemies);
      setDiceThrown(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameStatus("gameOver");
    } else if (currentStage > 30) {
      setGameStatus("gameWon");
    }
  }, [playerHealth, currentStage]);

  const handleBuffSelection = (selectedBuff) => {
    if (playerCoins >= selectedBuff.cost) {
      setPlayerCoins((prev) => prev - selectedBuff.cost);
      switch (selectedBuff.type) {
        case "extraDice":
          setBuffs((prev) => ({ ...prev, extraDice: prev.extraDice + 1 }));
          break;
        case "heal":
          setPlayerHealth((prev) => prev + selectedBuff.amount);
          setPlayerHealAnimation(true);
          break;
        case "damageReduction":
          setBuffs((prev) => ({ ...prev, damageReduction: prev.damageReduction + selectedBuff.amount }));
          break;
        default:
          break;
      }
      setCollectedBuffs((prev) => [...prev, selectedBuff]);
      setShowShop(false);
      setShowCompanionShop(true);
    } else {
      alert("Yeterli coin yok!");
    }
  };

  const handleCompanionSelection = (selectedCompanion) => {
    if (playerCoins >= selectedCompanion.cost) {
      setPlayerCoins((prev) => prev - selectedCompanion.cost);
      setCompanion(selectedCompanion);
      setCompanionHealth(30);
      setShowCompanionShop(false);
      startNewStage();
    } else {
      alert("Yeterli coin yok!");
    }
  };

  const startGame = () => {
    setDiceValues([]);
    setDiceThrown(false);
    setPlayerHealth(selectedPlayer.health);
    setPlayerCoins(0);
    setBuffs({ extraDice: 0, damageReduction: 0 });
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

  const selectPlayerCharacter = (player) => {
    setSelectedPlayer(player);
    setPlayerHealth(player.health);
  };

  // Modern card–themed character selection screen (texts in Turkish except game name)
  if (gameStatus === "start") {
    return (
      <div className="modern-character-selection-screen">
        {isPortrait && (
          <div className="portrait-warning">
            <FaMobileAlt className="mobile-icon" />
            <p>En iyi deneyim için lütfen cihazınızı yatay moda çevirin.</p>
          </div>
        )}
        <header className="selection-header">
          <h1 className="game-title">Dices & Rabbits</h1>
          <h2 className="selection-subtitle">Şampiyonunu Seç</h2>
        </header>
        <div className="character-grid">
          {playerData.map((player) => (
            <div
              key={player.id}
              className={`character-card ${selectedPlayer && selectedPlayer.id === player.id ? "selected" : ""}`}
              onClick={() => selectPlayerCharacter(player)}
            >
              <div className="card-image">
                <img src={player.image} alt={player.name} />
              </div>
              <div className="card-details">
                <h3>{player.name}</h3>
                <p className="description">{player.description}</p>
                <div className="stats">
                  <span>Can: {player.health}</span>
                  <span>Yetenek: {player.ability.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedPlayer && (
          <button className="start-game-button" onClick={startGame}>
            Oyuna Başla
          </button>
        )}
      </div>
    );
  }

  if (showShop) {
    return (
      <div className="game-container">
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
        <div className="coin-status">
          <img src="/images/coin_icon.png" alt="Coins" className="coin-icon" />
          <span>{playerCoins}</span>
        </div>
        <CompanionShop onSelectCompanion={handleCompanionSelection} playerCoins={playerCoins} />
      </div>
    );
  }

  return (
    <div className="game-container">
      {gameStatus === "playing" && (
        <>
          <div className="coin-status">
            <span>🪙 {playerCoins}</span>
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
                onHealthSlotDrop={onHealthSlotDrop}
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
          </div>
          <button
            onClick={() => {
              if (!diceThrown) {
                throwDice();
                setDiceThrown(true);
              } else {
                endTurn();
                setDiceThrown(false);
              }
            }}
            className="throw-dice-button"
          >
            {diceThrown ? "Eli Bitir" : "Zar At"}
          </button>
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
          {coinAnimation && (
            <div className="coin-animation">
              <span>🪙</span>
            </div>
          )}
        </>
      )}

      {gameStatus === "gameOver" && (
        <div className="end-screen">
          <h1>Oyun Bitti</h1>
          <p>{currentStage} bölüme kadar ilerledin.</p>
          <button onClick={() => setGameStatus("start")} className="restart-button">
            Yeniden Başla
          </button>
        </div>
      )}

      {gameStatus === "gameWon" && (
        <div className="end-screen">
          <h1>Tebrikler!</h1>
          <p>Tüm bölümleri tamamladın!</p>
          <button onClick={() => setGameStatus("start")} className="restart-button">
            Yeniden Başla
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
