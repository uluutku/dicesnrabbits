// PlayerCard.jsx
import React from "react";
import "./PlayerCard.css";

const PlayerCard = ({ playerHealth }) => {
  const maxHealth = 60;
  const healthPercentage = (playerHealth / maxHealth) * 100;

  return (
    <div className="player-card">
      <h3>Player</h3>
      <div className="health-bar">
        <div
          className="health-fill"
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>
      <p>
        {playerHealth} / {maxHealth} HP
      </p>
    </div>
  );
};

export default PlayerCard;
