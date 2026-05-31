import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_HP = 30;
const BASE_MANA = 50;

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

export interface CharacterStats {
  vida: number;
  fuerza: number;
  intelecto: number;
  sigilo: number;
  agilidad: number;
  encanto: number;
  maestroHechizos: number;
}

export type StatKey = keyof CharacterStats;

export interface Character {
  id: string;

  name: string;
  image: string | null;

  level: number;

  vida: number;
  vidaMax: number;

  mana: number;
  manaMax: number;

  exp: number;
  expNeeded: number;

  oro: number;

  savedStats: CharacterStats;

  availablePoints: number;
}

interface CharacterStore {
  characters: Character[];

  selectedCharacterId: string;

  pendingStats: CharacterStats | null;
  pendingAvailable: number;

  // personajes
  createCharacter: () => void;
  deleteCharacter: (id: string) => boolean;
  selectCharacter: (id: string) => void;

  // getters
  currentCharacter: Character | null;

  // identidad
  setName: (name: string) => void;
  setImage: (image: string | null) => void;

  // combate
  adjustVida: (delta: number) => void;
  adjustMana: (delta: number) => void;
  adjustOro: (delta: number) => void;

  setVida: (value: number) => void;
  setMana: (value: number) => void;
  setOro: (value: number) => void;
  setExp: (value: number) => void;

  addExp: () => void;
  removeExp: () => void;

  addExpAmount: (amount: number) => void;
  removeExpAmount: (amount: number) => void;

  useSkill: (manaCost: number) => boolean;

  // stats
  openStats: () => void;
  closeStats: () => void;

  adjustPendingStat: (stat: StatKey, delta: number) => void;

  saveStats: () => void;
}

// ─────────────────────────────────────────────
// FUNCIONES
// ─────────────────────────────────────────────

export const getExpNeeded = (level: number): number => {
  if (level === 1) return 3;
  if (level === 2) return 6;
  if (level === 3) return 10;
  if (level === 4) return 15;
  if (level === 5) return 25;

  return 25 + (level - 5) * 15;
};

export const calcVidaMax = (vidaStat: number): number =>
  BASE_HP + (vidaStat - 1) * 3;

export const calcManaMax = (intelectoStat: number): number =>
  BASE_MANA + (intelectoStat - 1) * 5;

// ─────────────────────────────────────────────
// STATS INICIALES
// ─────────────────────────────────────────────

const INITIAL_STATS: CharacterStats = {
  vida: 1,
  fuerza: 1,
  intelecto: 1,
  sigilo: 1,
  agilidad: 1,
  encanto: 1,
  maestroHechizos: 1,
};

// ─────────────────────────────────────────────
// CREAR PERSONAJE
// ─────────────────────────────────────────────

const createBaseCharacter = (): Character => {
  const id = Date.now().toString();

  return {
    id,

    name: "Nuevo Héroe",
    image: null,

    level: 1,

    vida: BASE_HP,
    vidaMax: BASE_HP,

    mana: BASE_MANA,
    manaMax: BASE_MANA,

    exp: 0,
    expNeeded: 3,

    oro: 0,

    savedStats: {
      ...INITIAL_STATS,
    },

    availablePoints: 7,
  };
};

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [createBaseCharacter()],

      selectedCharacterId: "",

      pendingStats: null,
      pendingAvailable: 0,

      get currentCharacter() {
        const s = get();

        return (
          s.characters.find((c) => c.id === s.selectedCharacterId) ||
          s.characters[0]
        );
      },

      // ─────────────────────────
      // PERSONAJES
      // ─────────────────────────

      createCharacter: () => {
        const newCharacter = createBaseCharacter();

        set((s) => ({
          characters: [newCharacter, ...s.characters],

          selectedCharacterId: newCharacter.id,
        }));
      },

      deleteCharacter: (id) => {
        const s = get();

        if (s.characters.length <= 1) {
          return false;
        }

        const filtered = s.characters.filter((c) => c.id !== id);

        let selectedId = s.selectedCharacterId;

        if (selectedId === id) {
          selectedId = filtered[0].id;
        }

        set({
          characters: filtered,
          selectedCharacterId: selectedId,
        });

        return true;
      },

      selectCharacter: (id) =>
        set({
          selectedCharacterId: id,
        }),

      // ─────────────────────────
      // IDENTIDAD
      // ─────────────────────────

      setName: (name) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === s.selectedCharacterId ? { ...c, name } : c,
          ),
        })),

      setImage: (image) =>
        set((s) => ({
          characters: s.characters.map((c) =>
            c.id === s.selectedCharacterId ? { ...c, image } : c,
          ),
        })),

      // ─────────────────────────
      // VIDA
      // ─────────────────────────

      adjustVida: (delta) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            return {
              ...c,
              vida: Math.max(0, Math.min(c.vidaMax, c.vida + delta)),
            };
          }),
        })),

      setVida: (value) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            return {
              ...c,
              vida: Math.max(0, Math.min(c.vidaMax, value)),
            };
          }),
        })),

      // ─────────────────────────
      // MANA
      // ─────────────────────────

      adjustMana: (delta) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            return {
              ...c,
              mana: Math.max(0, Math.min(c.manaMax, c.mana + delta)),
            };
          }),
        })),

      setMana: (value) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            return {
              ...c,
              mana: Math.max(0, Math.min(c.manaMax, value)),
            };
          }),
        })),

      // ─────────────────────────
      // ORO
      // ─────────────────────────

      adjustOro: (delta) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            return {
              ...c,
              oro: Math.max(0, c.oro + delta),
            };
          }),
        })),

      setOro: (value) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            return {
              ...c,
              oro: Math.max(0, value),
            };
          }),
        })),

      setExp: (value) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            let newExp = Math.max(0, value);

            let level = c.level;

            let availablePoints = c.availablePoints;

            let leveledUp = false;

            while (newExp >= getExpNeeded(level)) {
              newExp -= getExpNeeded(level);

              level++;

              availablePoints += 3;

              leveledUp = true;
            }

            return {
              ...c,

              exp: newExp,

              level,

              expNeeded: getExpNeeded(level),

              availablePoints,

              vida: leveledUp ? c.vidaMax : c.vida,

              mana: leveledUp ? c.manaMax : c.mana,
            };
          }),
        })),

      // ─────────────────────────
      // EXPERIENCIA
      // ─────────────────────────

      addExp: () => {
        get().addExpAmount(1);
      },

      removeExp: () => {
        get().removeExpAmount(1);
      },

      addExpAmount: (amount) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            let newExp = c.exp + amount;

            let level = c.level;

            let availablePoints = c.availablePoints;

            let leveledUp = false;

            while (newExp >= getExpNeeded(level)) {
              newExp -= getExpNeeded(level);

              level++;

              availablePoints += 3;

              leveledUp = true;
            }

            return {
              ...c,

              exp: newExp,
              level,

              expNeeded: getExpNeeded(level),

              availablePoints,

              vida: leveledUp ? c.vidaMax : c.vida,

              mana: leveledUp ? c.manaMax : c.mana,
            };
          }),
        })),

      removeExpAmount: (amount) =>
        set((s) => ({
          characters: s.characters.map((c) => {
            if (c.id !== s.selectedCharacterId) {
              return c;
            }

            return {
              ...c,
              exp: Math.max(0, c.exp - amount),
            };
          }),
        })),

      // ─────────────────────────
      // HABILIDADES
      // ─────────────────────────

      useSkill: (manaCost) => {
        const s = get();

        const current = s.currentCharacter;

        if (!current) {
          return false;
        }

        if (current.mana < manaCost) {
          return false;
        }

        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === state.selectedCharacterId
              ? {
                  ...c,
                  mana: c.mana - manaCost,
                }
              : c,
          ),
        }));

        return true;
      },

      // ─────────────────────────
      // STATS
      // ─────────────────────────

      openStats: () => {
        const s = get();

        const current =
          s.characters.find((c) => c.id === s.selectedCharacterId) ||
          s.characters[0];

        if (!current) return;

        set({
          pendingStats: {
            ...current.savedStats,
          },

          pendingAvailable: current.availablePoints,
        });
      },

      closeStats: () =>
        set({
          pendingStats: null,
          pendingAvailable: 0,
        }),

      adjustPendingStat: (stat, delta) => {
        const s = get();

        if (!s.pendingStats) return;

        const curr = s.pendingStats[stat];

        const current = s.currentCharacter;

        if (!current) return;

        const saved = current.savedStats[stat];

        if (delta > 0) {
          if (s.pendingAvailable <= 0) return;

          set({
            pendingStats: {
              ...s.pendingStats,
              [stat]: curr + 1,
            },

            pendingAvailable: s.pendingAvailable - 1,
          });
        } else {
          if (curr <= saved) return;

          set({
            pendingStats: {
              ...s.pendingStats,
              [stat]: curr - 1,
            },

            pendingAvailable: s.pendingAvailable + 1,
          });
        }
      },

      saveStats: () => {
        const s = get();

        const current = s.currentCharacter;

        if (!s.pendingStats || !current) {
          return;
        }

        const newVidaMax = calcVidaMax(s.pendingStats.vida);

        const newManaMax = calcManaMax(s.pendingStats.intelecto);

        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== state.selectedCharacterId) {
              return c;
            }

            const oldVidaMax = c.vidaMax;

            const vidaDiff = newVidaMax - oldVidaMax;

            const oldManaMax = c.manaMax;

            const manaDiff = newManaMax - oldManaMax;

            return {
              ...c,

              savedStats: {
                ...s.pendingStats!,
              },

              availablePoints: s.pendingAvailable,

              vidaMax: newVidaMax,
              manaMax: newManaMax,

              vida: Math.min(c.vida + vidaDiff, newVidaMax),

              mana: Math.min(c.mana + manaDiff, newManaMax),
            };
          }),

          pendingStats: null,
          pendingAvailable: 0,
        }));
      },
    }),
    {
      name: "rpg-multi-character",

      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (!state.selectedCharacterId && state.characters.length > 0) {
          state.selectedCharacterId = state.characters[0].id;
        }
      },
    },
  ),
);
