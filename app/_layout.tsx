import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Fragment } from "react";
import Toast from "react-native-toast-message";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Fragment>
          {/* STATUS BAR */}
          <StatusBar style="dark" />

          {/* NAVIGATION */}
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* HOME */}
            <Stack.Screen name="index" />

            {/* LOGIN */}
            <Stack.Screen name="login" />

            {/* TAB NAVIGATION */}
            <Stack.Screen name="(tabs)" />

            {/* DETAIL PRODUK */}
            <Stack.Screen
              name="product/[id]"
              options={{
                headerShown: true,
                title: "Detail Produk",
              }}
            />
          </Stack>

          {/* 🔔 GLOBAL TOAST */}
          <Toast />
        </Fragment>
      </CartProvider>
    </AuthProvider>
  );
}