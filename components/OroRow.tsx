import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Icons } from "./icons";

type OroRowProps = {
  value: number;

  onMinus: () => void;
  onPlus: () => void;

  onLongMinus?: () => void;
  onLongPlus?: () => void;
};

export default function OroRow({
  value,
  onMinus,
  onPlus,
  onLongMinus,
  onLongPlus,
}: OroRowProps) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>Oro</Text>

      {/* BOTÓN - */}
      <TouchableOpacity
        style={styles.adjBtn}
        onPress={onMinus}
        onLongPress={onLongMinus}
        delayLongPress={350}
      >
        <Icons.minus size={18} color="#d4af37" />
      </TouchableOpacity>

      {/* ORO */}
      <Text style={styles.oroValue}>
        <Icons.coin size={18} color="#ffd038" /> {value}
      </Text>

      {/* BOTÓN + */}
      <TouchableOpacity
        style={styles.adjBtn}
        onPress={onPlus}
        onLongPress={onLongPlus}
        delayLongPress={350}
      >
        <Icons.plus size={18} color="#d4af37" />
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

  oroValue: {
    flex: 1,
    color: "#ffd038",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
  },
});
