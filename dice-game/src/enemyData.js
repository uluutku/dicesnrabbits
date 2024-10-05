// enemyData.js
const enemyData = [
  {
    id: "enemy1",
    name: "Goblin",
    image: "/images/goblin.png",
    attack: 2,
    description: "A small, mischievous creature.",
    slots: [
      { id: "slot1", type: "exact", value: 3 }, // Exact slot: requires dice value of 3
      { id: "slot2", type: "number", value: 4 }, // Number slot: value decreases by dice value
    ],
  },
  {
    id: "enemy2",
    name: "Orc",
    image: "/images/orc.png",
    attack: 4,
    description: "A brutish warrior with a thirst for battle.",
    slots: [
      { id: "slot1", type: "higher", value: 3 }, // Higher slot: dice value > 3
      { id: "slot2", type: "lower", value: 4 }, // Lower slot: dice value < 4
    ],
  },
  // Add more enemies as desired
];

export default enemyData;
