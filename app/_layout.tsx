import React from "react";
import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Icons } from "../components/icons";

import { useCharacterStore } from "../store/characterStore";

function HeaderTitle({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Icon size={18} color="#d4af37" weight="fill" />
      <Text
        style={{
          color: "#d4af37",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </View>
  );
}

export default function RootLayout() {
  const { selectedCharacterId, characters } = useCharacterStore();

  const character = characters.find((c) => c.id === selectedCharacterId);

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0d0d1a" },
          headerTintColor: "#d4af37",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            color: "#d4af37",
          },
          contentStyle: { backgroundColor: "#0d0d1a" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerBackVisible: false,
            headerTitle: () => (
              <HeaderTitle icon={Icons.crown} title="Galería de Personajes" />
            ),
          }}
        />

        <Stack.Screen
          name="character"
          options={{
            headerTitle: () => (
              <HeaderTitle icon={Icons.mc} title="Mi Personaje" />
            ),
          }}
        />

        <Stack.Screen
          name="skills"
          options={{
            headerTitle: () => (
              <HeaderTitle icon={Icons.skills} title="Habilidades" />
            ),

            headerRight: () =>
              character ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Icons.mana size={16} color="#74b9ff" weight="fill" />

                  <Text
                    style={{
                      color: "#74b9ff",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {character.mana} / {character.manaMax}
                  </Text>
                </View>
              ) : null,
          }}
        />

        <Stack.Screen
          name="stats"
          options={{
            headerTitle: () => (
              <HeaderTitle icon={Icons.chart} title="Estadísticas" />
            ),
          }}
        />
      </Stack>
    </>
  );
}
