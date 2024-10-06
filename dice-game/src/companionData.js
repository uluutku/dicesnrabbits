// companionData.js

const companionData = [
  {
    id: "companion1",
    name: "Şifacı Baykuş Ovi",
    description: "3= bir zar kullanarak ana karakteri 5HP iyileştirir.",
    ability: {
      name: "Can Üfle",
      type: "healPlayer",
      activationType: "diceValue",
      diceValue: 3,
      amount: 5, // Heals 5 HP
      slotText: "=3", // Text to display on the ability slot
    },
    cost: 5,
    image: "/images/companion-baykus.png",
  },
  {
    id: "companion2",
    name: "Tilki Suyikastçi",
    description: "Kırmızı bir zar kullanarak tüm düşmanlara 2 hasar verir.",
    ability: {
      name: "Suyikast",
      type: "attackEnemy",
      activationType: "diceColor",
      diceColor: "red",
      amount: 2, // Deals 2 damage to all enemies
      slotText: "K. Zar",
    },
    cost: 5,
    image: "/images/companion-fox.png",
  },
  {
    id: "companion3",
    name: "Can Tosba",
    description: "6= bir zar kullanarak kendini 4HP iyileştirir.",
    ability: {
      name: "Tosba Canı",
      type: "healCompanion",
      activationType: "diceValue",
      diceValue: 6,
      amount: 4, // Heals 4 HP
      slotText: "=6",
    },
    cost: 5,
    image: "/images/companion-kaplumbaga.png",
  },
];

export default companionData;
