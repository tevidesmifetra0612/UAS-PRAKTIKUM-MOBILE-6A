import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "@/components/AppButton";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import { getProductDetail, type Product } from "@/services/api";

type Status = "loading" | "success" | "error";

const formatPrice = (price: number) =>
  `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 STATE JUMLAH
  const [qty, setQty] = useState(1);

  const loadProduct = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const data = await getProductDetail(id);
      setProduct(data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal memuat detail produk.");
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (status === "loading") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingView label="Memuat detail produk..." />
      </SafeAreaView>
    );
  }

  if (status === "error" || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorView message={errorMessage} onRetry={loadProduct} />
      </SafeAreaView>
    );
  }

  const discountedPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <Stack.Screen options={{ title: product.title }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: product.thumbnail }}
          style={[styles.image, { width }]}
          contentFit="cover"
        />

        <View style={styles.body}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.stockText}>
              · Stok: {product.stock > 0 ? product.stock : "Habis"}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {discountedPrice && (
              <Text style={styles.oldPrice}>{formatPrice(discountedPrice)}</Text>
            )}
          </View>

          {/* 🔥 FITUR QTY */}
          <View style={styles.qtyContainer}>
            <Pressable
              style={styles.qtyButton}
              onPress={() => setQty(qty > 1 ? qty - 1 : 1)}
            >
              <Text style={styles.qtyText}>➖</Text>
            </Pressable>

            <Text style={styles.qtyNumber}>{qty}</Text>

            <Pressable
              style={styles.qtyButton}
              onPress={() => setQty(qty + 1)}
            >
              <Text style={styles.qtyText}>➕</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          label={isInCart(product.id) ? "Tambah Lagi" : "Tambah ke Keranjang"}
          onPress={() => {
            addToCart(product, qty);
            Alert.alert("Berhasil", `Ditambahkan ${qty} item ke keranjang`);
          }}
          disabled={product.stock === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  image: {
    aspectRatio: 1.2,
    backgroundColor: colors.surface,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  category: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  ratingText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: "600",
  },
  stockText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  price: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.primary,
  },
  oldPrice: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },

  // 🔥 STYLE QTY
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  qtyButton: {
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyText: {
    fontSize: 18,
  },
  qtyNumber: {
    fontSize: 18,
    marginHorizontal: 15,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});