import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { useCharacterStore } from "../store/characterStore";

import PulsingDot from "../components/PulsingDot";
import StatBar from "../components/StatBar";
import OroRow from "../components/OroRow";

import { Icons } from "../components/icons";

export default function CharacterScreen() {
  const router = useRouter();

  const [editingName, setEditingName] = useState(false);

  const {
    selectedCharacterId,
    characters,
    setName,
    setImage,
    adjustVida,
    adjustMana,
    addExp,
    removeExp,
    adjustOro,
    openStats,
  } = useCharacterStore();

  const character = characters.find((c) => c.id === selectedCharacterId);

  if (!character) return null;

  const {
    name,
    image,
    level,
    vida,
    vidaMax,
    mana,
    manaMax,
    exp,
    expNeeded,
    oro,
    savedStats,
    availablePoints,
  } = character;

  const hasPoints = availablePoints > 0;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const stats = [
    {
      icon: <Icons.sword size={16} color="#a337fc" />,
      label: "Fuerza",
      value: savedStats.fuerza,
    },

    {
      icon: <Icons.magic size={16} color="#274cf1" />,
      label: "Intelecto",
      value: savedStats.intelecto,
    },

    {
      icon: <Icons.agility size={16} color="#7ae27a" />,
      label: "Agilidad",
      value: savedStats.agilidad,
    },

    {
      icon: <Icons.cat size={16} color="#cf60bd" />,
      label: "Encanto",
      value: savedStats.encanto,
    },

    {
      icon: <Icons.stealth size={16} color="#a9b5b6" />,
      label: "Sigilo",
      value: savedStats.sigilo,
    },
  ];

  if (savedStats.maestroHechizos > 0) {
    stats.push({
      icon: <Icons.MHUD size={16} color="#00c2e4" />,
      label: "MHUD",
      value: savedStats.maestroHechizos,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* NOMBRE */}
      {editingName ? (
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          onBlur={() => setEditingName(false)}
        />
      ) : (
        <TouchableOpacity onPress={() => setEditingName(true)}>
          <Text style={styles.nameText}>
            {name} <Icons.edit size={14} color="#d4af37" />
          </Text>
        </TouchableOpacity>
      )}

      {/* IMAGEN */}
      <TouchableOpacity style={styles.imgWrap} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.charImg} />
        ) : (
          <View style={styles.imgPlaceholder}>
            <Icons.user size={56} color="#eee" />

            <Text style={styles.imgHint}>Toca para elegir tu personaje</Text>
          </View>
        )}

        <View style={styles.imgEditBadge}>
          <Icons.image size={14} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* NIVEL */}
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>✦ Nivel {level} ✦</Text>
      </View>

      {/* BARRAS */}
      <View style={styles.card}>
        <StatBar
          label="Vida"
          current={vida}
          max={vidaMax}
          color="#c0392b"
          onMinus={() => adjustVida(-1)}
          onPlus={() => adjustVida(1)}
        />

        <View style={styles.divider} />

        <StatBar
          label="Mana"
          current={mana}
          max={manaMax}
          color="#2980b9"
          onMinus={() => adjustMana(-1)}
          onPlus={() => adjustMana(1)}
        />

        <View style={styles.divider} />

        <StatBar
          label="Exp"
          current={exp}
          max={expNeeded}
          color="#27ae60"
          onMinus={removeExp}
          onPlus={addExp}
        />

        <View style={styles.divider} />

        <OroRow
          value={oro}
          onMinus={() => adjustOro(-1)}
          onPlus={() => adjustOro(1)}
        />
      </View>

      {/* BOTONES */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => router.push("/skills")}
        >
          <Text style={styles.navBtnText}>
            <Icons.skills size={16} color="#d4af37" />
            {"\n"}
            Habilidades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => {
            openStats();
            router.push("/stats");
          }}
        >
          <Text style={styles.navBtnText}>
            <Icons.chart size={16} color="#d4af37" />
            {"\n"}
            Estadísticas
          </Text>

          {hasPoints && (
            <View style={styles.dotWrap}>
              <PulsingDot />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estadísticas del Personaje</Text>

        <View style={styles.summaryGrid}>
          {stats.map((s) => (
            <View key={`${s.label}-${s.value}`} style={styles.summaryItem}>
              <View style={styles.summaryLeft}>
                {s.icon}

                <Text style={styles.summaryLabel}>{s.label}</Text>
              </View>

              <Text style={styles.summaryVal}>{s.value}</Text>
            </View>
          ))}
        </View>

        {availablePoints > 0 && (
          <Text style={styles.pointsHint}>
            ⚠️ Tienes {availablePoints} punto
            {availablePoints > 1 ? "s" : ""} sin asignar
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d1a",
  },

  content: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
  },

  nameInput: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d4af37",
    borderBottomWidth: 2,
    borderBottomColor: "#d4af37",
    textAlign: "center",
    minWidth: 200,
    marginBottom: 18,
    paddingBottom: 4,
  },

  nameText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d4af37",
    marginBottom: 18,
  },

  imgWrap: {
    width: 200,
    height: 200,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#d4af37",
    overflow: "hidden",
    marginBottom: 16,
  },

  charImg: {
    width: "100%",
    height: "100%",
  },

  imgPlaceholder: {
    flex: 1,
    backgroundColor: "#332f30",
    alignItems: "center",
    justifyContent: "center",
  },

  imgHint: {
    color: "#eee",
    textAlign: "center",
    fontSize: 13,
  },

  imgEditBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 6,
  },

  levelBadge: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ff9a27",
    marginBottom: 16,
  },

  levelText: {
    color: "#ff9a27",
    fontSize: 17,
    fontWeight: "bold",
  },

  card: {
    width: "100%",
    backgroundColor: "#12122a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a50",
  },

  cardTitle: {
    color: "#f3bc09",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#1e1e3a",
    marginVertical: 8,
  },

  navRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  navBtn: {
    flex: 1,
    backgroundColor: "#1a1a35",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#d4af37",
    alignItems: "center",
    position: "relative",
  },

  navBtnText: {
    color: "#d4af37",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  dotWrap: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  summaryItem: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a38",
  },

  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  summaryLabel: {
    color: "#ffffff",
    fontSize: 13,
  },

  summaryVal: {
    color: "#d4af37",
    fontSize: 13,
    fontWeight: "bold",
  },

  pointsHint: {
    color: "#f1c40f",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
});
