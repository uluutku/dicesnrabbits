// playerData.js

const playerData = [
  {
    id: "player1",
    name: "Rabbit Wizard",
    description: "A wise rabbit with magical powers.",
    health: 50,
    ability: {
      name: "Dice Roll",
      type: "extraDice",
      activationType: "diceValue",
      diceValue: 5,
      amount: 2, // Adds 2 extra dice
      slotText: "=5",
      description: "Drop a dice with value 5 to gain 2 extra dice.",
    },
    image: "/images/generic.png",
  },
  {
    id: "player2",
    name: "Warrior Bear",
    description: "A strong bear with immense strength.",
    health: 60,
    ability: {
      name: "Power Strike",
      type: "attackEnemy",
      activationType: "diceValue",
      diceValue: 6,
      amount: 5, // Deals 5 damage to all enemies
      slotText: "=6",
      description: "Drop a dice with value 6 to deal 5 damage to all enemies.",
    },
    image: "/images/generic.png",
  },
  {
    id: "player3",
    name: "Healer Fox",
    description: "A cunning fox with healing abilities.",
    health: 45,
    ability: {
      name: "Healing Light",
      type: "healPlayer",
      activationType: "diceValue",
      diceValue: 4,
      amount: 10, // Heals the player for 10 HP
      slotText: "=4",
      description: "Drop a dice with value 4 to heal yourself by 10 HP.",
    },
    image: "/images/generic.png",
  },
];

export default playerData;
