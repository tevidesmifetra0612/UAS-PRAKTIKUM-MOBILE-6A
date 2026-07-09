import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, spacing } from "@/constants/theme";
import { AppButton } from "@/components/AppButton";

type ErrorViewProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorView({
  message = "Gagal memuat data. Silakan coba lagi.",
  onRetry,
}: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={40} color={colors.danger} />
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <AppButton label="Coba lagi" onPress={onRetry} variant="outline" style={styles.button} />
      )}
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
  button: {
    marginTop: spacing.sm,
    minWidth: 140,
  },
});
