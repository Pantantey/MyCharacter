export interface Skill {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  multiplier: number;
}

export interface SkillCategory {
  label: string;
  icon: keyof typeof import("../components/icons").Icons;

  color: string;

  skills: Skill[];
}

export interface SkillsData {
  fuerza: SkillCategory;
  intelecto: SkillCategory;
  sigilo: SkillCategory;
  agilidad: SkillCategory;
  encanto: SkillCategory;
}

export const SKILLS_DATA: SkillsData = {
  fuerza: {
    label: "Fuerza",
    icon: "sword",
    color: "#a337fc",
    skills: [
      {
        id: "f1",
        name: "Golpe Devastador",
        description: "Un poderoso impacto",
        manaCost: 10,
        multiplier: 2,
      },
      {
        id: "f2",
        name: "Escudo de Hierro",
        description: "Barrera defensiva",
        manaCost: 20,
        multiplier: 4,
      },
      {
        id: "f3",
        name: "Furia Berserker",
        description: "Libera toda tu ",
        manaCost: 35,
        multiplier: 4,
      },
    ],
  },

  intelecto: {
    label: "Intelecto",
    icon: "magic",
    color: "#274cf1",
    skills: [
      {
        id: "i1",
        name: "Bola de Fuego",
        description: "Esfera ígnea que explota al impacto",
        manaCost: 15,
        multiplier: 2,
      },
      {
        id: "i2",
        name: "Rayo de Hielo",
        description: "Congela al enemigo en su lugar",
        manaCost: 25,
        multiplier: 4,
      },
      {
        id: "i3",
        name: "Tormenta Arcana",
        description: "Devastación mágica de máximo poder",
        manaCost: 45,
        multiplier: 4,
      },
    ],
  },

  sigilo: {
    label: "Sigilo",
    icon: "stealth",
    color: "#a9b5b6",
    skills: [
      {
        id: "s1",
        name: "Paso Silencioso",
        description: "Te mueves sin hacer el menor ruido",
        manaCost: 10,
        multiplier: 2,
      },
      {
        id: "s2",
        name: "Sombra Etérea",
        description: "Te vuelves invisible entre las sombras",
        manaCost: 25,
        multiplier: 4,
      },
      {
        id: "s3",
        name: "Golpe Mortal",
        description: "Ataque letal desde las tinieblas",
        manaCost: 40,
        multiplier: 4,
      },
    ],
  },

  agilidad: {
    label: "Agilidad",
    icon: "agility",
    color: "#7ae27a",
    skills: [
      {
        id: "a1",
        name: "Esquiva Veloz",
        description: "Evita el próximo ataque con gracia",
        manaCost: 10,
        multiplier: 2,
      },
      {
        id: "a2",
        name: "Lluvia de Flechas",
        description: "Dispara múltiples proyectiles a la vez",
        manaCost: 25,
        multiplier: 4,
      },
      {
        id: "a3",
        name: "Tornado de Hojas",
        description: "Ataque giratorio que arrasa el área",
        manaCost: 35,
        multiplier: 4,
      },
    ],
  },

  encanto: {
    label: "Encanto",
    icon: "cat",
    color: "#cf60bd",
    skills: [
      {
        id: "e1",
        name: "Seducción",
        description: "Distrae al enemigo con tu carisma",
        manaCost: 15,
        multiplier: 2,
      },
      {
        id: "e2",
        name: "Ilusión Perfecta",
        description: "Crea un clon tuyo perfecto",
        manaCost: 25,
        multiplier: 4,
      },
      {
        id: "e3",
        name: "Dominio Mental",
        description: "Controlas la mente de tu enemigo",
        manaCost: 45,
        multiplier: 4,
      },
    ],
  },
};
