import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCart } from "@/context/CartContext";

export default function CartScreen() {
  const {
    items,
    increaseQty,
    decreaseQty,
    removeFromCart,
    toggleSelect,
  } = useCart();

  // ✅ hanya item yang dicentang
  const selectedItems = items.filter((item) => item.selected);

  const totalItems = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Keranjang kosong 🛒</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.product.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* ✅ CHECKBOX */}
            <Pressable
              style={[
                styles.checkbox,
                item.selected && styles.checkboxActive,
              ]}
              onPress={() => toggleSelect(item.product.id)}
            >
              {item.selected && <Text style={styles.check}>✓</Text>}
            </Pressable>

            {/* 🖼️ IMAGE (FIX DI SINI) */}
            <Image
              source={{
                uri:
                  item.product.thumbnail ??
                  item.product.images?.[0] ??
                  "https://via.placeholder.com/100",
              }}
              style={styles.image}
            />

            {/* INFO */}
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {item.product.title}
              </Text>
              <Text style={styles.price}>
                ${item.product.price}
              </Text>
            </View>

            {/* 🔢 QTY */}
            <View style={styles.qty}>
              <Pressable
                onPress={() =>
                  decreaseQty(item.product.id)
                }
              >
                <Text style={styles.btn}>−</Text>
              </Pressable>

              <Text>{item.quantity}</Text>

              <Pressable
                onPress={() =>
                  increaseQty(item.product.id)
                }
              >
                <Text style={styles.btn}>+</Text>
              </Pressable>
            </View>

            {/* ❌ DELETE */}
            <Pressable
              onPress={() =>
                removeFromCart(item.product.id)
              }
            >
              <Text style={{ color: "red" }}>Hapus</Text>
            </Pressable>
          </View>
        )}
      />

      {/* 🔥 FOOTER */}
      <View style={styles.footer}>
        <View>
          <Text>Total ({totalItems})</Text>
          <Text style={styles.total}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>

        <Pressable
          style={[
            styles.checkout,
            totalItems === 0 && { backgroundColor: "#ccc" },
          ]}
          disabled={totalItems === 0}
          onPress={() => {
            console.log("Checkout item:", selectedItems);
          }}
        >
          <Text style={{ color: "#fff" }}>
            Checkout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    padding: 16,
    gap: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },

  check: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  image: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
  },

  price: {
    color: "#4CAF50",
  },

  qty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  btn: {
    fontSize: 18,
    paddingHorizontal: 6,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
  },

  checkout: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});