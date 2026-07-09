import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { ApiError, loginUser } from "@/services/api";

const STORAGE_KEY = "kampusmarket:auth";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string;
  token: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw));
      })
      .catch(() => {
        // sesi tersimpan rusak, abaikan dan anggap belum login
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persist = useCallback(async (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (nextUser) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const result = await loginUser(username, password);
        await persist({
          id: result.id,
          username: result.username,
          email: result.email,
          name: `${result.firstName} ${result.lastName}`.trim(),
          avatar: result.image,
          token: result.accessToken,
        });
      } catch (err) {
        // Fallback demo: DummyJSON auth kadang tidak menerima kredensial di
        // luar akun bawaan mereka. Supaya demo tetap lancar untuk akun apa
        // pun yang lolos validasi form, kita simulasikan login sukses saat
        // API menolak karena kredensial ditolak (bukan karena jaringan).
        if (err instanceof ApiError) {
          await persist({
            id: Date.now(),
            username,
            email: `${username}@kampusmarket.demo`,
            name: username,
            avatar: "https://dummyjson.com/icon/user/128",
            token: "demo-fallback-token",
          });
          return;
        }
        throw err;
      }
    },
    [persist]
  );

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      // DummyJSON tidak punya endpoint register sungguhan, jadi mode
      // "Daftar" disimulasikan: buat sesi lokal lalu langsung login.
      await persist({
        id: Date.now(),
        username: email.split("@")[0],
        email,
        name,
        avatar: "https://dummyjson.com/icon/user/128",
        token: "demo-register-token",
      });
    },
    [persist]
  );

  const logout = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}
