 export const ORDERS = [
  {
    id: "907653",
    type: "Pickup",
    time: "20:30pm",
    status: "On-process",
    payment: {
      gateway: "khalti",
      transactionId: "",
      status: "pending",
      amount: 53.82,
    },
    items: [
      {
        name: "'69 Camaro",
        series: "Muscle Icons",
        year: "1969",
        price: "6.99",
        category: "muscle",
        description:
          "A gloss red die-cast tribute to the classic American muscle era.",
        finish: "Gloss Red",
        image: "",
        qty: 4,
      },
      {
        name: "Twin Mill",
        series: "Redline Originals",
        year: "1969",
        price: "6.99",
        category: "originals",
        description:
          "The twin-engine concept car that defined Hot Wheels' first generation.",
        finish: "Matte Purple",
        image: "",
        qty: 2,
      },
      {
        name: "Bone Shaker",
        series: "Limited Editions",
        year: "2006",
        price: "6.99",
        category: "originals",
        description:
          "A chopper-inspired hot rod with a skull grille and flame details.",
        finish: "Limited Edition",
        image: "",
        qty: 1,
      },
    ],
  },
  {
    id: "907654",
    type: "Ship",
    time: "20:35pm",
    status: "On-process",
    payment: {
      gateway: "khalti",
      transactionId: "",
      status: "pending",
      amount: 30.76,
    },
    items: [
      {
        name: "Deora II",
        series: "Imports Collection",
        year: "2000",
        price: "6.99",
        category: "imports",
        description: "A futuristic concept truck with a sleek chrome finish.",
        finish: "Chrome",
        image: "",
        qty: 3,
      },
      {
        name: "Twin Mill",
        series: "Redline Originals",
        year: "1969",
        price: "6.99",
        category: "originals",
        description:
          "The twin-engine concept car that defined Hot Wheels' first generation.",
        finish: "Matte Purple",
        image: "",
        qty: 1,
      },
    ],
  },
  {
    id: "907655",
    type: "Pickup",
    time: "20:40pm",
    status: "On-process",
    payment: {
      gateway: "khalti",
      transactionId: "",
      status: "failed",
      amount: 15.38,
    },
    items: [
      {
        name: "Bone Shaker",
        series: "Limited Editions",
        year: "2006",
        price: "6.99",
        category: "originals",
        description:
          "A chopper-inspired hot rod with a skull grille and flame details.",
        finish: "Limited Edition",
        image: "",
        qty: 2,
      },
    ],
  },
  {
    id: "907656",
    type: "Ship",
    time: "20:45pm",
    status: "On-process",
    payment: {
      gateway: "khalti",
      transactionId: "",
      status: "pending",
      amount: 46.13,
    },
    items: [
      {
        name: "'69 Camaro",
        series: "Muscle Icons",
        year: "1969",
        price: "6.99",
        category: "muscle",
        description:
          "A gloss red die-cast tribute to the classic American muscle era.",
        finish: "Gloss Red",
        image: "",
        qty: 5,
      },
      {
        name: "Deora II",
        series: "Imports Collection",
        year: "2000",
        price: "6.99",
        category: "imports",
        description: "A futuristic concept truck with a sleek chrome finish.",
        finish: "Chrome",
        image: "",
        qty: 1,
      },
    ],
  },
  {
    id: "907648",
    type: "Pickup",
    time: "18:10pm",
    status: "Completed",
    payment: {
      gateway: "khalti",
      transactionId: "TXN-907648-KH",
      status: "paid",
      amount: 23.07,
    },
    items: [
      {
        name: "'69 Camaro",
        series: "Muscle Icons",
        year: "1969",
        price: "6.99",
        category: "muscle",
        description:
          "A gloss red die-cast tribute to the classic American muscle era.",
        finish: "Gloss Red",
        image: "",
        qty: 3,
      },
    ],
  },
  {
    id: "907641",
    type: "Ship",
    time: "16:50pm",
    status: "Completed",
    payment: {
      gateway: "khalti",
      transactionId: "TXN-907641-KH",
      status: "paid",
      amount: 30.76,
    },
    items: [
      {
        name: "Twin Mill",
        series: "Redline Originals",
        year: "1969",
        price: "6.99",
        category: "originals",
        description:
          "The twin-engine concept car that defined Hot Wheels' first generation.",
        finish: "Matte Purple",
        image: "",
        qty: 2,
      },
      {
        name: "Deora II",
        series: "Imports Collection",
        year: "2000",
        price: "6.99",
        category: "imports",
        description: "A futuristic concept truck with a sleek chrome finish.",
        finish: "Chrome",
        image: "",
        qty: 2,
      },
    ],
  },
];
export const PAYMENT_STATUS_TINT = {
  pending: "bg-amber-100 text-amber-600",
  paid: "bg-emerald-100 text-emerald-600",
  failed: "bg-red-100 text-red-600",
};

export const STATUS_TINT = {
  "On-process": "bg-amber-100 text-amber-600",
  Completed: "bg-emerald-100 text-emerald-600",
};

export const CATEGORY_TINT = {
  muscle: "bg-red-100 text-red-600",
  imports: "bg-blue-100 text-blue-600",
  exotics: "bg-purple-100 text-purple-600",
  originals: "bg-slate-200 text-slate-600",
};