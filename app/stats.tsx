import React, { useEffect, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";

import { useCharacterStore, StatKey } from "../store/characterStore";

import { Icons } from "../components/icons";

const STAT_CONFIG: Record<
  StatKey,
  {
    label: string;
    desc: string;
    min: number;
    icon: React.ReactNode;
  }
> = {
  vida: {
    label: "Vida",
    desc: "Cada punto +3 HP máximo",
    min: 1,
    icon: <Icons.heart size={16} color="#d61f1f" weight="fill" />,
  },

  intelecto: {
    label: "Intelecto",
    desc: "Cada punto +5 Mana máximo",
    min: 1,
    icon: <Icons.magic size={16} color="#274cf1" weight="fill" />,
  },

  fuerza: {
    label: "Fuerza",
    desc: "Mejora habilidades de fuerza",
    min: 1,
    icon: <Icons.sword size={16} color="#a337fc" weight="fill" />,
  },

  sigilo: {
    label: "Sigilo",
    desc: "Mejora habilidades de sigilo",
    min: 1,
    icon: <Icons.stealth size={16} color="#a9b5b6" weight="fill" />,
  },

  agilidad: {
    label: "Agilidad",
    desc: "Mejora habilidades de agilidad",
    min: 1,
    icon: <Icons.agility size={16} color="#7ae27a" weight="fill" />,
  },

  encanto: {
    label: "Encanto",
    desc: "Mejora habilidades de encanto",
    min: 1,
    icon: <Icons.cat size={18} color="#cf60bd" weight="fill" />,
  },

  maestroHechizos: {
    label: "Maestro de Hechizos\nULTRA DEFINITIVO",
    desc: "Aumenta todo daño",
    min: 1,
    icon: <Icons.MHUD size={18} color="#00c2e4" weight="fill" />,
  },
};

type StatRowProps = {
  statKey: StatKey;
  current: number;
  saved: number;
  onMinus: () => void;
  onPlus: () => void;
};

function StatRow({ statKey, current, saved, onMinus, onPlus }: StatRowProps) {
  const cfg = STAT_CONFIG[statKey];

  const canDecrease = current > saved;
  const addedSinceLastSave = current - saved;

  return (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {cfg.icon}
          <Text style={styles.rowLabel}>{cfg.label}</Text>
        </View>

        <Text style={styles.rowDesc}>{cfg.desc}</Text>
      </View>

      <View style={styles.rowControls}>
        <TouchableOpacity
          style={[styles.ctrlBtn, !canDecrease && styles.ctrlBtnOff]}
          onPress={onMinus}
          disabled={!canDecrease}
        >
          <Text
            style={[styles.ctrlBtnText, !canDecrease && styles.ctrlBtnTextOff]}
          >
            −
          </Text>
        </TouchableOpacity>

        <View style={styles.valWrap}>
          <Text style={styles.valText}>{current}</Text>

          {addedSinceLastSave > 0 && (
            <Text style={styles.addedBadge}>+{addedSinceLastSave}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.ctrlBtn} onPress={onPlus}>
          <Text style={styles.ctrlBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const router = useRouter();

  const {
    selectedCharacterId,
    characters,
    pendingStats,
    pendingAvailable,
    openStats,
    adjustPendingStat,
    saveStats,
  } = useCharacterStore();

  const character = characters.find((c) => c.id === selectedCharacterId);

  useEffect(() => {
    if (!pendingStats) {
      openStats();
    }
  }, [pendingStats, openStats]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        const s = useCharacterStore.getState();

        if (s.pendingStats) {
          s.closeStats();
        }
      };
    }, []),
  );

  if (!character || !pendingStats) {
    return null;
  }

  const { savedStats } = character;

  const totalSpent = (Object.keys(STAT_CONFIG) as StatKey[]).reduce(
    (acc, key) => acc + (pendingStats[key] - savedStats[key]),
    0,
  );

  const handleSave = () => {
    saveStats();
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Puntos */}
      <View style={styles.pointsCard}>
        <View>
          <Text style={styles.pointsLabel}>Puntos disponibles</Text>

          {totalSpent > 0 && (
            <Text style={styles.spentHint}>
              {totalSpent} asignado{totalSpent !== 1 ? "s" : ""} (sin guardar)
            </Text>
          )}
        </View>

        <Text
          style={[
            styles.pointsVal,
            pendingAvailable > 0 && styles.pointsValYellow,
          ]}
        >
          {pendingAvailable}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        {(Object.keys(STAT_CONFIG) as StatKey[]).map((key) => (
          <StatRow
            key={key}
            statKey={key}
            current={pendingStats[key]}
            saved={savedStats[key]}
            onMinus={() => adjustPendingStat(key, -1)}
            onPlus={() => adjustPendingStat(key, 1)}
          />
        ))}
      </View>

      {/* Guardar */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>
          <Icons.save size={16} color="#fff" /> Guardar cambios
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d1a",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  pointsCard: {
    backgroundColor: "#0e2a0e",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#27ae60",
  },

  pointsLabel: {
    color: "#2ecc71",
    fontSize: 15,
    fontWeight: "bold",
  },

  spentHint: {
    color: "#f1c40f",
    fontSize: 11,
    marginTop: 4,
  },

  pointsVal: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },

  pointsValYellow: {
    color: "#f1c40f",
  },

  statsCard: {
    backgroundColor: "#12122a",
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a50",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e3a",
  },

  rowInfo: {
    flex: 1,
    marginRight: 8,
  },

  rowLabel: {
    color: "#ddd",
    fontSize: 14,
    fontWeight: "600",
  },

  rowDesc: {
    color: "#5c5c80",
    fontSize: 11,
    marginTop: 2,
  },

  rowControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  ctrlBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1e1e40",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d4af37",
  },

  ctrlBtnOff: {
    borderColor: "#2a2a2a",
    backgroundColor: "#111",
  },

  ctrlBtnText: {
    color: "#d4af37",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 24,
  },

  ctrlBtnTextOff: {
    color: "#2a2a2a",
  },

  valWrap: {
    alignItems: "center",
    minWidth: 36,
  },

  valText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  addedBadge: {
    color: "#2ecc71",
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#0e2a0e",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2,
  },

  saveBtn: {
    backgroundColor: "#1e7e34",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#27ae60",
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  cancelBtn: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },

  cancelBtnText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
});
