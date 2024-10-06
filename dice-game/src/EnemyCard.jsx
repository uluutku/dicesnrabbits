// EnemyCard.jsx
import "./EnemyCard.css";
import Slot from "./Slot";

const EnemyCard = ({ enemy, onDamage }) => {
  const isDead = enemy.slots.every((slot) => slot.isClosed);

  return (
    <div className={`enemy-card ${isDead ? "defeated" : ""}`}>
      <img src={enemy.image} alt={enemy.name} className="enemy-image" />
      <h3>{enemy.name}</h3>
      <p>Güç: {enemy.attack}</p>
      {enemy.description && (
        <p className="enemy-description">{enemy.description}</p>
      )}

      {/* Render Slots */}
      <div className="slots-container">
        {enemy.slots.map((slot) => (
          <Slot
            key={slot.id}
            slot={slot}
            enemyId={enemy.id}
            onDamage={onDamage}
            isDead={isDead}
          />
        ))}
      </div>

      {isDead && (
        <div className="defeated-overlay">
          <strong>Sıştı</strong>
        </div>
      )}
    </div>
  );
};

export default EnemyCard;
