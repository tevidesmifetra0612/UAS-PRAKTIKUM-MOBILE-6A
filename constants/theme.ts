// Tema terpusat: warna, spacing, radius, font, shadow.
// Semua komponen & halaman WAJIB memakai file ini agar tampilan konsisten.

export const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#DBEAFE",
  secondary: "#F97316",
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",

  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",

  text: "#0F172A",
  textMuted: "#64748B",
  textInverse: "#FFFFFF",
  placeholder: "#94A3B8",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
};

export const shadow = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};
