/** Central de textos e elementos para personalizar sem mexer nos componentes. */
export const PARTY_CONTENT = {
  eyebrow: "UMA FESTINHA ESPECIALMENTE PRA VOCÊ",
  festival: "XABI FEST",
  year: "2026",
  introduction: {
    kicker: "convocação oficial",
    heading: "Gabi, temos uma missão!",
    description:
      "A festinha de hoje precisa de uns detalhes importantíssimos.",
    action: "preparar minha festa",
  },
  status: {
    waiting: "tudo pronto pra começar ✨",
    preparing: "organizando a melhor festa do multiverso...",
    cake: "prioridades: bolo, churrasco e caipirinha 🍓",
    fandom: "a xu foi oficialmente convidada 💿",
    car: "ALGUÉM CHAMOU O MCQUEEN? 🏎️",
    finished: "festa oficialmente inaugurada! 🎊",
  },
  finale: {
    miniTitle: "",
    title: "PARABÉNS, GABI! ★",
    text: "Não sei organizar um churrasco, mas uma festa inteirinha dentro de um site? Aí já é comigo!",
    wish: "Espero que seu dia tenha sido tão divertido quanto essa pequena bagunça e que seu novo ciclo seja cheio de coisas boas, momentos inesquecíveis e muito amor.",
    ending:
      "Amei que ao virar amiga da xautora, ganhamos você! 💗",
    signature: "com carinho, Xu",
    replay: "rever a festinha ↺",
  },
} as const;

export type PartyItemId =
  | "balloons"
  | "pop"
  | "team"
  | "grill"
  | "cake"
  | "drink"
  | "tart"
  | "car"
  | "taylor"
  | "taylorEncore"
  | "meme"
  | "glam"
  | "fairies"
  | "racecar"
  | "popStar"
  | "thirteen";

export type PartyRegion = "top" | "left" | "right" | "base";

export type PartyItemData = {
  id: PartyItemId;
  src: string;
  alt: string;
  region: PartyRegion;
};

const ASSETS = "/assets/final";

export const PARTY_DECOR = {
  header: `${ASSETS}/02-decor-elements/y2k-header-strip.png`,
  stickers: `${ASSETS}/02-decor-elements/y2k-sticker-collage.png`,
  doodles: `${ASSETS}/02-decor-elements/br-chaos-doodles.png`,
} as const;

export const PARTY_ITEMS: PartyItemData[] = [
  {
    id: "balloons",
    region: "top",
    src: `${ASSETS}/01-party-items/balloons-y2k.png`,
    alt: "Balões pop coloridos de aniversário",
  },
  {
    id: "team",
    region: "right",
    src: `${ASSETS}/00-user-provided/spfc-shield.webp`,
    alt: "Escudo do São Paulo Futebol Clube",
  },
  {
    id: "taylor",
    region: "left",
    src: `${ASSETS}/00-user-provided/taylor-cutout-1.webp`,
    alt: "Recorte de Taylor Swift escolhido pela Xu",
  },
  // {
  //   id: "pop",
  //   region: "left",
  //   src: `${ASSETS}/02-decor-elements/disco-party-collage.png`,
  //   alt: "Sticker de globo de discoteca, música e fandom",
  // },
  // {
  //   id: "fairies",
  //   region: "right",
  //   src: `${ASSETS}/03-fandom-elements/winx-inspired-fairies.png`,
  //   alt: "Sticker de fadas inspirado na estética Winx",
  // },
  // {
  //   id: "taylorEncore",
  //   region: "left",
  //   src: `${ASSETS}/00-user-provided/taylor-cutout-2.webp`,
  //   alt: "Segundo recorte de Taylor Swift",
  // },
  // {
  //   id: "racecar",
  //   region: "base",
  //   src: `${ASSETS}/03-fandom-elements/cars-inspired-racecar.png`,
  //   alt: "Pequeno sticker de corrida inspirado em Cars",
  // },
  {
    id: "meme",
    region: "right",
    src: `${ASSETS}/00-user-provided/swifties-com-lula.webp`,
    alt: "Meme Swifties com Lula",
  },
  // {
  //   id: "glam",
  //   region: "left",
  //   src: `${ASSETS}/03-fandom-elements/white-chicks-inspired-glam-duo.png`,
  //   alt: "Dupla glam inspirada em White Chicks",
  // },
  // {
  //   id: "popStar",
  //   region: "right",
  //   src: `${ASSETS}/03-fandom-elements/taylor-inspired-pop-star.png`,
  //   alt: "Sticker de estrela pop inspirado em Taylor",
  // },
  {
    id: "thirteen",
    region: "left",
    src: `${ASSETS}/03-fandom-elements/number-13-sticker.png`,
    alt: "Sticker do número 13, referência à piada swiftie faz o L",
  },
  {
    id: "grill",
    region: "base",
    src: `${ASSETS}/00-user-provided/grill.png`,
    alt: "Churrasqueira com carnes, linguiças, espetinhos e brasas acesas",
  },
  {
    id: "tart",
    region: "base",
    src: `${ASSETS}/00-user-provided/strawberry-tart-user.webp`,
    alt: "A torta de morango original escolhida pela Xu",
  },
  // {
  //   id: "cake",
  //   region: "base",
  //   src: `${ASSETS}/01-party-items/birthday-cake-y2k.png`,
  //   alt: "Bolo de aniversário com velas e morangos",
  // },
  {
    id: "drink",
    region: "base",
    src: `${ASSETS}/00-user-provided/drink.png`,
    alt: "Caipirinha com frutas, gelo e caju na borda do copo",
  },
  {
    id: "car",
    region: "base",
    src: `${ASSETS}/00-user-provided/mcqueen-user-cutout.webp`,
    alt: "Recorte original do Relâmpago McQueen, carro número 95",
  },
];
