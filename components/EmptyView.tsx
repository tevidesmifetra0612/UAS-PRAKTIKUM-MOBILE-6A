import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { colors, fontSize, spacing } from "@/constants/theme";

type EmptyViewProps = {
  message?: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
};

export function EmptyView({
  message = "Tidak ada data untuk ditampilkan.",
  icon = "file-tray-outline",
}: EmptyViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color={colors.textMuted} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: "center",
  },
});
