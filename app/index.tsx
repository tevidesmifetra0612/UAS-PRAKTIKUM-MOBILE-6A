import { Redirect } from "expo-router";

import { LoadingView } from "@/components/LoadingView";
import { useAuth } from "@/context/AuthContext";

// AUTH GATE: titik masuk aplikasi. Selama sesi tersimpan sedang dicek,
// tampilkan loading. Setelah itu arahkan ke tabs (sudah login) atau
// halaman login (belum login) — user tidak boleh menyentuh (tabs)
// tanpa login terlebih dulu.
export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView label="Menyiapkan KampusMarket..." />;
  }

  return <Redirect href={user ? "/(tabs)" : "/login"} />;
}
