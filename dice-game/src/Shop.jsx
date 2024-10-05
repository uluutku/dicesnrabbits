// Shop.jsx
import React from "react";
import "./Shop.css";

const Shop = ({ onSelectBuff }) => {
  const buffOptions = [
    {
      id: "buff1",
      name: "Extra Dice",
      description: "Gain one extra dice per turn.",
      type: "extraDice",
    },
    {
      id: "buff2",
      name: "Heal",
      description: "Restore 10 health points.",
      type: "heal",
      amount: 10,
    },
    {
      id: "buff3",
      name: "Shield",
      description: "Reduce enemy damage by 1.",
      type: "damageReduction",
      amount: 1,
    },
    // Add more buffs as desired
  ];

  // Randomly select three buffs
  const shuffledBuffs = buffOptions.sort(() => 0.5 - Math.random());
  const buffsToShow = shuffledBuffs.slice(0, 3);

  return (
    <div className="shop-container">
      <h2>Shop</h2>
      <p>Select one buff:</p>
      <div className="buff-options">
        {buffsToShow.map((buff) => (
          <div key={buff.id} className="buff-card">
            <h3>{buff.name}</h3>
            <p>{buff.description}</p>
            <button
              className="select-button"
              onClick={() => onSelectBuff(buff)}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
