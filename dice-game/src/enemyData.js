// enemyData.js
const enemyData = [
  {
    id: "enemy1",
    name: "Carrot Golem",
    image: "/images/carrot-golem.png",
    attack: 2,
    description: "A giant golem made of carrots.",
    slots: [
      { id: "slot1", type: "exact", value: 2 },
      { id: "slot2", type: "number", value: 5 },
    ],
  },
  {
    id: "enemy2",
    name: "Fox Bandit",
    image: "/images/fox-bandit.png",
    attack: 3,
    description: "A sneaky fox who steals carrots.",
    slots: [
      { id: "slot1", type: "higher", value: 3 },
      { id: "slot2", type: "lower", value: 4 },
    ],
  },
  {
    id: "enemy3",
    name: "Wolf Warrior",
    image: "/images/wolf-warior.png",
    attack: 4,
    description: "A fierce warrior wolf.",
    slots: [
      { id: "slot1", type: "number", value: 8 },
      { id: "slot2", type: "exact", value: 6 },
    ],
  },
  {
    id: "enemy4",
    name: "Eagle Eye",
    image: "/images/eagle-eye.png",
    attack: 5,
    description: "An eagle with sharp vision.",
    slots: [
      { id: "slot1", type: "higher", value: 4 },
      { id: "slot2", type: "higher", value: 5 },
    ],
  },
  // Add more enemies as desired
];

export default enemyData;
