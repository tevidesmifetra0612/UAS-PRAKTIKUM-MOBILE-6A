import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "@/components/AppButton";
import { AppInput } from "@/components/AppInput";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import {
  validateAuthForm,
  type AuthFormErrors,
  type AuthFormValues,
} from "@/utils/validation";

type Mode = "login" | "register";

export default function LoginScreen() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [values, setValues] = useState<AuthFormValues>({
    name: "",
    email: "emilys@gmail.com",
    password: "emilyspass",
  });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sudah login (mis. setelah reload) -> langsung lempar ke tabs.
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const setField = (field: keyof AuthFormValues, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
  };

  const handleSubmit = async () => {
    const nextErrors = validateAuthForm(values, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        // DummyJSON auth/login butuh "username", bukan email.
        // Kredensial demo emilys/emilyspass sudah diisi otomatis di atas.
        await login(values.email.trim(), values.password);
      } else {
        await register(values.name.trim(), values.email.trim(), values.password);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setErrors({});
    setSubmitError(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="storefront" size={32} color={colors.textInverse} />
            </View>
            <Text style={styles.title}>KampusMarket</Text>
            <Text style={styles.subtitle}>
              Marketplace jual-beli barang bekas mahasiswa
            </Text>
          </View>

          <View style={styles.tabSwitch}>
            <TabButton
              label="Masuk"
              active={mode === "login"}
              onPress={() => mode !== "login" && toggleMode()}
            />
            <TabButton
              label="Daftar"
              active={mode === "register"}
              onPress={() => mode !== "register" && toggleMode()}
            />
          </View>

          <View style={styles.form}>
            {mode === "register" && (
              <AppInput
                label="Nama Lengkap"
                value={values.name}
                onChangeText={(text) => setField("name", text)}
                placeholder="Nama kamu"
                error={errors.name}
                autoCapitalize="words"
              />
            )}

            <AppInput
              label={mode === "login" ? "Username / Email" : "Email"}
              value={values.email}
              onChangeText={(text) => setField("email", text)}
              placeholder="nama@kampus.ac.id"
              error={errors.email}
              keyboardType="email-address"
            />

            <AppInput
              label="Password"
              value={values.password}
              onChangeText={(text) => setField("password", text)}
              placeholder="Minimal 6 karakter"
              error={errors.password}
              secureTextEntry
            />

            {submitError && <Text style={styles.submitError}>{submitError}</Text>}

            <AppButton
              label={mode === "login" ? "Masuk" : "Daftar & Masuk"}
              onPress={handleSubmit}
              loading={submitting}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Kredensial demo (DummyJSON)</Text>
            <Text style={styles.demoText}>Username: emilys@gmail.com</Text>
            <Text style={styles.demoText}>Password: emilyspass</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <View style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Text
        style={[styles.tabButtonText, active && styles.tabButtonTextActive]}
        onPress={onPress}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  tabSwitch: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textMuted,
  },
  tabButtonTextActive: {
    color: colors.textInverse,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  submitError: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  demoBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },
  demoTitle: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  demoText: {
    fontSize: fontSize.xs,
    color: colors.primaryDark,
  },
});
