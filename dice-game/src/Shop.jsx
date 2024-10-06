// Shop.jsx
import React from "react";
import "./Shop.css";

const Shop = ({ onSelectBuff, playerCoins }) => {
  const buffOptions = [
    {
      id: "buff1",
      name: "Extra Zar",
      description: "Her tur atmak işin fazladan bir zar.",
      type: "extraDice",
      cost: 15,
    },
    {
      id: "buff2",
      name: "İyileşme",
      description: "Ana karakterin 10 can yeniler.",
      type: "heal",
      amount: 10,
      cost: 10,
    },
    {
      id: "buff3",
      name: "Kalkan",
      description: "Ana karakterin artık 1 hasar az alır.",
      type: "damageReduction",
      amount: 1,
      cost: 20,
    },
    // Add more buffs as desired
  ];

  // Randomly select three buffs
  const shuffledBuffs = buffOptions.sort(() => 0.5 - Math.random());
  const buffsToShow = shuffledBuffs.slice(0, 3);

  return (
    <div className="shop-container">
      <h2>Tükkan</h2>
      <p>{playerCoins} coinin var. Satın almak için bir güç seç:</p>
      <div className="buff-options">
        {buffsToShow.map((buff) => (
          <div key={buff.id} className="buff-card">
            <h3>{buff.name}</h3>
            <p>{buff.description}</p>
            <p className="buff-cost">Fiyat: {buff.cost} coin</p>
            <button
              className="select-button"
              onClick={() => onSelectBuff(buff)}
              disabled={playerCoins < buff.cost}
            >
              {playerCoins >= buff.cost ? "Satın Al" : "Yetersiz Bakiye"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
