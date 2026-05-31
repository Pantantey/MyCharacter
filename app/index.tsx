import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import { useCharacterStore } from "../store/characterStore";
import { Icons } from "../components/icons";

export default function IndexScreen() {
  const router = useRouter();

  const { characters, createCharacter, deleteCharacter, selectCharacter } =
    useCharacterStore();

  const handleDelete = (id: string, name: string) => {
    if (characters.length <= 1) {
      Alert.alert("⚠️ No permitido", "Debe existir al menos un personaje.");
      return;
    }

    Alert.alert("🗑️ Eliminar personaje", `¿Deseas eliminar a ${name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteCharacter(id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => {
              selectCharacter(item.id);
              router.push("/character");
            }}
          >
            {/* DELETE ICON */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id, item.name)}
            >
              <Icons.trash size={16} color="#ff6b6b" weight="bold" />
            </TouchableOpacity>

            {/* IMAGE OR PLACEHOLDER */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Icons.user size={52} color="#ffffff" weight="duotone" />
              </View>
            )}

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={styles.level}>✦ Lv.{item.level}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* CREATE BUTTON */}
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => createCharacter()}
      >
        <Text style={styles.createBtnText}>
          <Icons.plus size={13} color="#fff" weight="bold" /> Crear personaje
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d1a",
  },

  list: {
    padding: 16,
    paddingBottom: 120,
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#12122a",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a50",
    position: "relative",
  },

  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteText: {
    color: "#ff6b6b",
    fontWeight: "bold",
    fontSize: 16,
  },

  image: {
    width: "100%",
    height: 170,
  },

  placeholder: {
    width: "100%",
    height: 170,
    backgroundColor: "#332f30",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderIcon: {
    fontSize: 50,
  },

  footer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    color: "#d4af37",
    fontWeight: "bold",
    flex: 1,
    marginRight: 6,
  },

  level: {
    color: "#ff9a27",
    fontWeight: "bold",
    fontSize: 12,
  },

  createBtn: {
    position: "absolute",
    bottom: 45,
    left: 20,
    right: 20,
    backgroundColor: "#1e7e34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27ae60",
  },

  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
