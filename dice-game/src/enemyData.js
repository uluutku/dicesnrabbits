// enemyData.js
const enemyData = [
  // Easy Enemies (Difficulty 1)
  {
    id: "enemy1",
    name: "Carrot Golem",
    image: "/images/carrot_golem.png",
    attack: 2,
    description: "A giant golem made of carrots.",
    difficulty: 1,
    slots: [
      { id: "slot1", type: "exact", value: 2 },
      { id: "slot2", type: "number", value: 5 },
    ],
  },
  {
    id: "enemy2",
    name: "Fox Bandit",
    image: "/images/fox_bandit.png",
    attack: 3,
    description: "A sneaky fox who steals carrots.",
    difficulty: 1,
    slots: [
      { id: "slot1", type: "higher", value: 3 },
      { id: "slot2", type: "lower", value: 4 },
    ],
  },
  // Medium Enemies (Difficulty 2)
  {
    id: "enemy3",
    name: "Wolf Warrior",
    image: "/images/wolf_warrior.png",
    attack: 4,
    description: "A fierce warrior wolf.",
    difficulty: 2,
    slots: [
      { id: "slot1", type: "number", value: 14 },
      { id: "slot2", type: "exact", value: 6 },
    ],
  },
  {
    id: "enemy4",
    name: "Eagle Eye",
    image: "/images/eagle_eye.png",
    attack: 5,
    description: "An eagle with sharp vision.",
    difficulty: 2,
    slots: [
      { id: "slot1", type: "higher", value: 12 },
      { id: "slot2", type: "higher", value: 5 },
    ],
  },
  // Hard Enemies (Difficulty 3)
  {
    id: "enemy5",
    name: "Shadow Hare",
    image: "/images/shadow_hare.png",
    attack: 6,
    description: "A dark reflection of yourself.",
    difficulty: 3,
    slots: [
      { id: "slot1", type: "exact", value: 6 },
      { id: "slot2", type: "higher", value: 4 },
    ],
  },
  {
    id: "enemy6",
    name: "Mystic Tortoise",
    image: "/images/mystic_tortoise.png",
    attack: 3,
    description: "An ancient tortoise with mystical powers.",
    difficulty: 3,
    slots: [{ id: "slot1", type: "number", value: 12 }],
  },
  // Boss Enemy (Difficulty 4)
  {
    id: "boss1",
    name: "Dragon King",
    image: "/images/dragon_king.png",
    attack: 10,
    description: "The mighty Dragon King, ruler of the skies.",
    difficulty: 4,
    slots: [
      { id: "slot1", type: "number", value: 20 },
      { id: "slot2", type: "exact", value: 6 },
      { id: "slot3", type: "higher", value: 5 },
    ],
  },
];

export default enemyData;
