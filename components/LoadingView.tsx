import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, spacing } from "@/constants/theme";

export function LoadingView({ label = "Memuat data..." }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{label}</Text>
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
  },
});
