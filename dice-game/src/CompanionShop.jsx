// CompanionShop.jsx
import React from "react";
import companionData from "./companionData";
import "./CompanionShop.css";

const CompanionShop = ({ onSelectCompanion, playerCoins }) => {
  // Randomly select three companions
  const shuffledCompanions = companionData.sort(() => 0.5 - Math.random());
  const companionsToShow = shuffledCompanions.slice(0, 3);

  return (
    <div className="shop-container">
      <h2>Companion Shop</h2>
      <p>You have {playerCoins} coins. Select a companion to purchase:</p>
      <div className="companion-options">
        {companionsToShow.map((companion) => (
          <div key={companion.id} className="companion-card">
            <h3>{companion.name}</h3>
            <img
              src={companion.image}
              alt={companion.name}
              className="companion-image"
            />
            <p>{companion.description}</p>
            <p className="companion-cost">Cost: {companion.cost} coins</p>
            <button
              className="select-button"
              onClick={() => onSelectCompanion(companion)}
              disabled={playerCoins < companion.cost}
            >
              {playerCoins >= companion.cost
                ? "Purchase"
                : "Insufficient Coins"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanionShop;
