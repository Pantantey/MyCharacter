import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Icons } from "./icons";

type StatBarProps = {
  label: string;
  current: number;
  max: number;
  color: string;
  onMinus: () => void;
  onPlus: () => void;
};

export default function StatBar({
  label,
  current,
  max,
  color,
  onMinus,
  onPlus,
}: StatBarProps) {
  const pct =
    max > 0
      ? Math.min((current / max) * 100, 100)
      : 0;

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>
        {label}
      </Text>

      <TouchableOpacity
        style={styles.adjBtn}
        onPress={onMinus}
      >
        <Icons.minus
          size={18}
          color="#d4af37"
        />
      </TouchableOpacity>

      <View style={styles.barWrap}>
        <View
          style={[
            styles.barFill,
            {
              width: `${pct}%`,
              backgroundColor: color,
            },
          ]}
        />

        <Text style={styles.barText}>
          {current} / {max}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.adjBtn}
        onPress={onPlus}
      >
        <Icons.plus
          size={18}
          color="#d4af37"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
  },

  statLabel: {
    color: "#fff",
    width: 40,
    fontSize: 13,
  },

  adjBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1e1e40",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3a3a6a",
    marginHorizontal: 6,
  },

  barWrap: {
    flex: 1,
    height: 30,
    backgroundColor: "#1a1a35",
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  barFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 15,
    opacity: 0.85,
  },

  barText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    zIndex: 1,
  },
});