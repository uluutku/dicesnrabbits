// enemyData.js

const enemyData = [
  {
    id: "enemy1",
    name: "Slime",
    description: "A weak slime creature.",
    attack: 5,
    difficulty: 1,
    coinDrop: 10, // Coins dropped when defeated
    slots: [
      { id: "slot1", type: "number", value: 5 },
      { id: "slot2", type: "exact", value: 2 },
    ],
    image: "/images/slime.png",
  },
  {
    id: "enemy2",
    name: "Goblin",
    description: "A sneaky goblin.",
    attack: 7,
    difficulty: 1,
    coinDrop: 15,
    slots: [
      { id: "slot1", type: "higher", value: 3 },
      { id: "slot2", type: "number", value: 4 },
    ],
    image: "/images/goblin.png",
  },
  {
    id: "enemy3",
    name: "Orc",
    description: "A strong orc warrior.",
    attack: 10,
    difficulty: 2,
    coinDrop: 20,
    slots: [
      { id: "slot1", type: "number", value: 10 },
      { id: "slot2", type: "exact", value: 5 },
      { id: "slot3", type: "higher", value: 4 },
    ],
    image: "/images/orc.png",
  },
  {
    id: "enemy4",
    name: "Skeleton",
    description: "A spooky skeleton.",
    attack: 8,
    difficulty: 2,
    coinDrop: 18,
    slots: [
      { id: "slot1", type: "lower", value: 4 },
      { id: "slot2", type: "number", value: 6 },
    ],
    image: "/images/skeleton.png",
  },
  {
    id: "enemy5",
    name: "Dark Mage",
    description: "A mage wielding dark magic.",
    attack: 12,
    difficulty: 3,
    coinDrop: 25,
    slots: [
      { id: "slot1", type: "exact", value: 6 },
      { id: "slot2", type: "number", value: 8 },
      { id: "slot3", type: "higher", value: 5 },
    ],
    image: "/images/dark_mage.png",
  },
  {
    id: "enemyBoss",
    name: "Dragon",
    description: "A fearsome dragon.",
    attack: 20,
    difficulty: 4,
    coinDrop: 100,
    slots: [
      { id: "slot1", type: "number", value: 20 },
      { id: "slot2", type: "number", value: 15 },
      { id: "slot3", type: "exact", value: 6 },
      { id: "slot4", type: "higher", value: 5 },
    ],
    image: "/images/dragon.png",
  },
  // Add more enemies as needed
];

export default enemyData;
