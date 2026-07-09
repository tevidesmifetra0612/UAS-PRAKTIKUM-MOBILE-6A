import { useEffect, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthFormValues = {
  name: string;
  email: string;
  password: string;
};

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

// Validasi form Login/Daftar sesuai ketentuan UAS:
// - nama wajib diisi, minimal 3 karakter (hanya mode daftar)
// - email wajib format valid
// - password minimal 6 karakter
export function validateAuthForm(
  values: AuthFormValues,
  mode: "login" | "register"
): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (mode === "register") {
    if (!values.name.trim()) {
      errors.name = "Nama wajib diisi.";
    } else if (values.name.trim().length < 3) {
      errors.name = "Nama minimal 3 karakter.";
    }
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.password) {
    errors.password = "Password wajib diisi.";
  } else if (values.password.length < 6) {
    errors.password = "Password minimal 6 karakter.";
  }

  return errors;
}

// Debounce nilai (mis. kata kunci pencarian) supaya tidak memicu
// request/filter berlebihan setiap kali user mengetik.
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
