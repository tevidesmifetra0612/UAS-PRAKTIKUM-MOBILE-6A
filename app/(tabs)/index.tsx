import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { EmptyView } from "@/components/EmptyView";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";
import { ProductCard } from "@/components/ProductCard";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  getCategoryList,
  getProducts,
  getProductsByCategory,
  searchProducts,
  type Product,
} from "@/services/api";
import { useDebounce } from "@/utils/validation";

const PAGE_SIZE = 10;

type Status = "loading" | "success" | "error" | "refreshing" | "loadingMore";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 400);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getCategoryList()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const fetchPage = useCallback(
    async (skip: number, mode: "replace" | "append" | "refresh") => {
      setStatus(
        mode === "append"
          ? "loadingMore"
          : mode === "refresh"
          ? "refreshing"
          : "loading"
      );
      setErrorMessage("");

      try {
        const response = debouncedQuery.trim()
          ? await searchProducts(debouncedQuery.trim(), PAGE_SIZE, skip)
          : selectedCategory
          ? await getProductsByCategory(selectedCategory, PAGE_SIZE, skip)
          : await getProducts(PAGE_SIZE, skip);

        setTotal(response.total);
        setProducts((prev) =>
          mode === "append" ? [...prev, ...response.products] : response.products
        );

        setStatus("success");
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Gagal memuat produk."
        );
        setStatus("error");
      }
    },
    [debouncedQuery, selectedCategory]
  );

  useEffect(() => {
    fetchPage(0, "replace");
  }, [debouncedQuery, selectedCategory]);

  const handleRefresh = useCallback(() => {
    fetchPage(0, "refresh");
  }, [fetchPage]);

  const handleLoadMore = useCallback(() => {
    if (
      status === "loading" ||
      status === "loadingMore" ||
      status === "refreshing"
    )
      return;

    if (products.length >= total) return;

    fetchPage(products.length, "append");
  }, [status, products.length, total, fetchPage]);

  const listHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        {/* SEARCH */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari produk..."
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </View>

        {/* CATEGORY */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const active = selectedCategory === item;
            return (
              <Pressable
                onPress={() => setSelectedCategory(active ? null : item)}
                style={[
                  styles.categoryChip,
                  active && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    ),
    [searchQuery, categories, selectedCategory]
  );

  if (status === "loading" && products.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {listHeader}
        <LoadingView label="Memuat produk..." />
      </SafeAreaView>
    );
  }

  if (status === "error" && products.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {listHeader}
        <ErrorView
          message={errorMessage}
          onRetry={() => fetchPage(0, "replace")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyView message="Produk tidak ditemukan." />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={status === "refreshing"}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={handleLoadMore}
        ListFooterComponent={
          status === "loadingMore" ? (
            <ActivityIndicator
              style={styles.footerLoader}
              color={colors.primary}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
  },
  categoryList: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  categoryChipTextActive: {
    color: colors.textInverse,
  },
  columnWrapper: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  footerLoader: {
    marginVertical: spacing.lg,
  },
});