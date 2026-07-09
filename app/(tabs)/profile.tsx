import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "@/components/AppButton";
import { colors, fontSize, radius, shadow, spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { totalItems, totalPrice } = useCart();

  const handleLogout = () => {
    Alert.alert("Keluar", "Yakin ingin keluar dari akun ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: () => logout() },
    ]);
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" />
        <Text style={styles.name}>{user.name || user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="cart-outline" size={22} color={colors.primary} />
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Item di keranjang</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="wallet-outline" size={22} color={colors.primary} />
          <Text style={styles.statValue}>
            ${totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.statLabel}>Total belanja</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow icon="person-outline" label="Username" value={user.username} />
        <InfoRow icon="mail-outline" label="Email" value={user.email} />
      </View>

      <AppButton
        label="Logout"
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    gap: 4,
    ...shadow.card,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.text,
  },
  logoutButton: {
    marginTop: "auto",
  },
});
