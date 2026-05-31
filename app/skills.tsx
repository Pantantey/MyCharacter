import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

import { useRouter } from "expo-router";

import { useCharacterStore } from "../store/characterStore";
import { SKILLS_DATA, Skill } from "../constants/skills";
import { Icons } from "../components/icons";

export default function SkillsScreen() {
  const router = useRouter();

  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);

  const [modalVisible, setModalVisible] = React.useState(false);

  const {
    selectedCharacterId,
    characters,
    useSkill: activateSkill,
  } = useCharacterStore();

  const character = characters.find((c) => c.id === selectedCharacterId);

  if (!character) return null;

  const { mana, savedStats } = character;

  const calculateDamage = (skill: Skill): number | string => {
    let baseStat = 1;

    if (skill.id.startsWith("f")) baseStat = savedStats.fuerza;

    if (skill.id.startsWith("i")) baseStat = savedStats.intelecto;

    if (skill.id.startsWith("s")) baseStat = savedStats.sigilo;

    if (skill.id.startsWith("a")) baseStat = savedStats.agilidad;

    if (skill.id.startsWith("e")) baseStat = savedStats.encanto;

    if (skill.id === "s2") {
      return 0;
    }
    if (skill.id === "e3") {
      return "?";
    }

    return baseStat * skill.multiplier + savedStats.maestroHechizos;
  };

  const handleSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSkill(null);
  };

  const confirmSkill = () => {
    if (!selectedSkill) return;

    if (mana < selectedSkill.manaCost) {
      return;
    }

    const success = activateSkill(selectedSkill.manaCost);

    if (success) {
      closeModal();
      router.back();
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* ================= CATEGORÍAS ================= */}
        {Object.entries(SKILLS_DATA).map(([key, category]) => {
          const CategoryIcon = Icons[category.icon as keyof typeof Icons];

          return (
            <View key={key} style={styles.categoryCard}>
              <View style={styles.catHeader}>
                <CategoryIcon size={18} color={category.color} weight="fill" />

                <Text style={[styles.catTitle, { color: category.color }]}>
                  {category.label}
                </Text>
              </View>

              <View style={styles.skillsGrid}>
                {category.skills.map((skill: Skill) => {
                  const canUse = mana >= skill.manaCost;

                  const damage = calculateDamage(skill);

                  return (
                    <TouchableOpacity
                      key={skill.id}
                      style={[styles.skillCard, !canUse && styles.skillCardOff]}
                      onPress={() => handleSkill(skill)}
                      activeOpacity={0.8}
                    >
                      {/* TOP */}
                      <View style={styles.skillTop}>
                        <Text
                          style={[
                            styles.skillName,
                            !canUse && styles.skillNameOff,
                          ]}
                          numberOfLines={2}
                        >
                          {skill.name}
                        </Text>
                      </View>

                      {/* DESC */}
                      <Text style={styles.skillDesc} numberOfLines={3}>
                        {skill.description}
                      </Text>

                      {/* BOTTOM */}
                      <View style={styles.bottomRow}>
                        {/* DAÑO */}
                        <View style={styles.damageRow}>
                          {skill.id === "i2" || skill.id === "e2" ? (
                            <Icons.shield
                              size={12}
                              color="#ffffff"
                              weight="fill"
                            />
                          ) : (
                            <Icons.sword
                              size={12}
                              color="#ff3131"
                              weight="fill"
                            />
                          )}

                          <Text
                            style={[
                              styles.damageText,
                              (skill.id === "i2" || skill.id === "e2") && {
                                color: "#ffffff",
                              },
                            ]}
                          >
                            {damage}
                          </Text>
                        </View>

                        {/* MANA */}
                        <View style={styles.manaCostRow}>
                          <Icons.mana size={12} color="#74b9ff" weight="fill" />

                          <Text
                            style={[
                              styles.manaCostText,
                              !canUse && styles.costTextOff,
                            ]}
                          >
                            {skill.manaCost}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ================= MODAL ================= */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedSkill && (
              <>
                <Text style={styles.modalTitle}>{selectedSkill.name}</Text>

                <Text style={styles.modalDesc}>
                  {selectedSkill.description}
                </Text>

                <View style={styles.modalStats}>
                  <View style={styles.modalStatRow}>
                    {selectedSkill.id === "i2" || selectedSkill.id === "e2" ? (
                      <Icons.shield size={16} color="#ffffff" weight="fill" />
                    ) : (
                      <Icons.sword size={16} color="#ff3131" weight="fill" />
                    )}

                    <Text
                      style={[
                        styles.modalDamage,
                        (selectedSkill.id === "i2" ||
                          selectedSkill.id === "e2") && {
                          color: "#ffffff",
                        },
                      ]}
                    >
                      {calculateDamage(selectedSkill)}
                    </Text>
                  </View>

                  <View style={styles.modalStatRow}>
                    <Icons.mana size={16} color="#74b9ff" weight="fill" />

                    <Text style={styles.modalMana}>
                      {selectedSkill.manaCost}
                    </Text>
                  </View>
                </View>

                {mana < selectedSkill.manaCost && (
                  <Text style={styles.noManaText}>
                    No tienes suficiente mana
                  </Text>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.useBtn,
                      mana < selectedSkill.manaCost && styles.useBtnDisabled,
                    ]}
                    onPress={confirmSkill}
                    disabled={mana < selectedSkill.manaCost}
                  >
                    <Text style={styles.useText}>Usar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d1a",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  categoryCard: {
    backgroundColor: "#12122a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2a2a50",
  },

  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a50",
  },

  catTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  skillCard: {
    width: "31%",
    backgroundColor: "#1e1e3e",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#3a3a6a",
    justifyContent: "space-between",
  },

  skillCardOff: {
    backgroundColor: "#141420",
    borderColor: "#222",
    opacity: 0.6,
  },

  skillTop: {
    alignItems: "center",
    marginBottom: 4,
  },

  skillName: {
    color: "#eee",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  skillNameOff: {
    color: "#444",
  },

  skillDesc: {
    color: "#7878aa",
    fontSize: 11,
    textAlign: "center",
    flex: 1,
    marginBottom: 8,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  damageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  manaCostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  damageText: {
    color: "#ff3131",
    fontSize: 11,
    fontWeight: "bold",
  },

  manaCostText: {
    color: "#74b9ff",
    fontSize: 11,
    fontWeight: "bold",
  },

  costTextOff: {
    color: "#333",
  },

  /* ================= MODAL ================= */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#16162b",
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
    borderColor: "#3a3a6a",
  },

  modalTitle: {
    color: "#d4af37",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  modalDesc: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  modalStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  modalStatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  modalDamage: {
    color: "#ff3131",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalMana: {
    color: "#74b9ff",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  useBtn: {
    flex: 1,
    backgroundColor: "#6c5ce7",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  useBtnDisabled: {
    backgroundColor: "#222",
  },

  cancelText: {
    color: "#f0f0f0",
    fontWeight: "bold",
  },

  useText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  noManaText: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
});
