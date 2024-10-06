// playerData.js

const playerData = [
  {
    id: "player1",
    name: "Büyücü Davşan",
    description: "Zar değiştirme büyüsü yapan bir büyücü davşan.",
    health: 50,
    ability: {
      name: "Zar Büyüsü",
      type: "extraDice",
      activationType: "diceValue",
      diceValue: 5,
      amount: 2,
      slotText: "=5",
      description: "5= bir zarı iki yeni rastgele zara dönüştürür.",
    },
    image: "/images/wizard-rabbit.png",
  },
  {
    id: "player2",
    name: "Güşlü Ayu",
    description: "Çok güşlü bi ayu.",
    health: 60,
    ability: {
      name: "Güş Vuruşu",
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
    name: "Şifacı Tilki",
    description: "Şifa basan medik tilki.",
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
