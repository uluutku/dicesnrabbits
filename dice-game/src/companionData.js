// companionData.js

const companionData = [
  {
    id: "companion1",
    name: "Healing Fairy",
    description:
      "Heals the player when a dice of value 3 is dropped on her ability slot.",
    ability: {
      type: "healPlayer",
      activationType: "diceValue",
      diceValue: 3,
      amount: 5, // Heals 5 HP
      slotText: "=3", // Text to display on the ability slot
    },
    cost: 5,
    image: "/images/generic.png",
  },
  {
    id: "companion2",
    name: "Fire Spirit",
    description:
      "Deals 2 extra damage to all enemies when a red dice is dropped on his ability slot.",
    ability: {
      type: "attackEnemy",
      activationType: "diceColor",
      diceColor: "red",
      amount: 2, // Deals 2 damage to all enemies
      slotText: "Red Dice",
    },
    cost: 5,
    image: "/images/generic.png",
  },
  {
    id: "companion3",
    name: "Guardian Golem",
    description:
      "Heals himself for 4 HP when a dice of value 6 is dropped on his ability slot.",
    ability: {
      type: "healCompanion",
      activationType: "diceValue",
      diceValue: 6,
      amount: 4, // Heals 4 HP
      slotText: "=6",
    },
    cost: 5,
    image: "/images/generic.png",
  },
];

export default companionData;
