import { useEffect, useState } from "react";
import {
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import { useCart } from "@/context/CartContext";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

// 🔥 ENABLE ANIMATION (ANDROID)
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function ProductCard({ product, onPress }: any) {
  const { addToCart } = useCart();

  const [qty, setQty] = useState(0);

  // 🎬 ANIMATION
  const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  // 💾 LOAD SAVED QTY
  useEffect(() => {
    const loadQty = async () => {
      const saved = await AsyncStorage.getItem(`qty-${product.id}`);
      if (saved) setQty(Number(saved));
    };
    loadQty();
  }, []);

  // 💾 SAVE QTY
  const saveQty = async (value: number) => {
    setQty(value);
    await AsyncStorage.setItem(`qty-${product.id}`, String(value));
  };

  // ➕
  const increase = () => {
    animate();
    saveQty(qty + 1);
  };

  // ➖
  const decrease = () => {
    animate();
    if (qty === 1) {
      saveQty(0);
    } else {
      saveQty(qty - 1);
    }
  };

  // 🛒 CONFIRM ADD
  const handleAddToCart = async () => {
    addToCart(product, qty);

    // 🔔 TOAST
    Toast.show({
      type: "success",
      text1: "Berhasil",
      text2: `${product.title} ditambahkan`,
    });

    // 💾 CLEAR TEMP
    await AsyncStorage.removeItem(`qty-${product.id}`);

    // 🔄 RESET
    animate();
    setQty(0);
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* IMAGE */}
      <Image source={{ uri: product.thumbnail }} style={styles.image} />

      {/* CONTENT */}
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>

        <Text style={styles.price}>${product.price}</Text>

        {/* 🟢 STEP 1 */}
        {qty === 0 ? (
          <Pressable
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              animate();
              saveQty(1);
            }}
          >
            <Text style={styles.addText}>+ Tambah</Text>
          </Pressable>
        ) : (
          <>
            {/* 🔵 STEP 2: QTY CONTROL */}
            <View style={styles.qtyContainer}>
              <Pressable
                style={styles.qtyBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  decrease();
                }}
              >
                <Text style={styles.qtySymbol}>−</Text>
              </Pressable>

              <Text style={styles.qtyText}>{qty}</Text>

              <Pressable
                style={styles.qtyBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  increase();
                }}
              >
                <Text style={styles.qtySymbol}>+</Text>
              </Pressable>
            </View>

            {/* 🔥 STEP 3: CONFIRM */}
            <Pressable
              style={styles.confirmButton}
              onPress={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              <Text style={styles.confirmText}>
                Tambah ke Keranjang ({qty})
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 120,
  },

  content: {
    padding: spacing.sm,
    gap: spacing.xs,
  },

  title: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.text,
  },

  price: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.primary,
  },

  addButton: {
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: 6,
    borderRadius: radius.md,
    alignItems: "center",
  },

  addText: {
    color: colors.textInverse,
    fontSize: fontSize.xs,
    fontWeight: "600",
  },

  qtyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },

  qtyBtn: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },

  qtySymbol: {
    fontSize: 16,
    fontWeight: "700",
  },

  qtyText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.text,
  },

  confirmButton: {
    marginTop: spacing.xs,
    backgroundColor: "#22c55e",
    paddingVertical: 6,
    borderRadius: radius.md,
    alignItems: "center",
  },

  confirmText: {
    color: "#fff",
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
});