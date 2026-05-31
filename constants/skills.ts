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
        name: "Golpe con palo",
        description: "Ataque común de mucha fuerza",
        manaCost: 0,
        multiplier: 3,
      },
      {
        id: "f2",
        name: "Furia destructiva",
        description: "Realiza un golpe letal",
        manaCost: 20,
        multiplier: 4,
      },
      {
        id: "f3",
        name: "Girar con espada",
        description: "Causa gran daño en área",
        manaCost: 35,
        multiplier: 3,
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
        name: " Bola de Energia",
        description: "Esfera que impacta y explota",
        manaCost: 20,
        multiplier: 3,
      },
      {
        id: "i2",
        name: "Escudo de Hielo",
        description: "Protege a un personaje",
        manaCost: 35,
        multiplier: 2,
      },
      {
        id: "i3",
        name: "Tormenta Arcana",
        description: "Devastación de magia en área",
        manaCost: 65,
        multiplier: 6,
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
        name: "Golpe por la espalda",
        description: "Daño x3 si no está en combate o está invisible",
        manaCost: 10,
        multiplier: 2,
      },
      {
        id: "s2",
        name: "Sombra Etérea",
        description: "Desaparece y deja de ser el objetivo",
        manaCost: 20,
        multiplier: 0,
      },
      {
        id: "s3",
        name: "Baile     Mortal",
        description: "Dispara muchas dagas a todos los enemigos",
        manaCost: 30,
        multiplier: 3,
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
        name: "Disparo recargado",
        description: "Cada tercer uso de esta habilidad hace daño x2",
        manaCost: 10,
        multiplier: 2,
      },
      {
        id: "a2",
        name: "Disparo recargado",
        description: "Disparo potente que aturde al objetivo 1 turno",
        manaCost: 25,
        multiplier: 4,
      },
      {
        id: "a3",
        name: "Lluvia de Flechas",
        description: "Ataque que arrasa el área y a los enemigos",
        manaCost: 30,
        multiplier: 3,
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
        name: "Risa Destructora",
        description: "Causa un daño menor",
        manaCost: 5,
        multiplier: 2,
      },
      {
        id: "e2",
        name: "Seducción pasajera",
        description: "El objetivo causa menos daño",
        manaCost: 15,
        multiplier: 3,
      },
      {
        id: "e3",
        name: "Dominio Mental",
        description: "El enemigo ataca a un aliado",
        manaCost: 50,
        multiplier: 4,
      },
    ],
  },
};
