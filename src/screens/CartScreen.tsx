// src/screens/CartScreen.tsx
import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartContext } from "../context/CartContext";

export const CartScreen = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartContext must be used within a CartProvider");
  }

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = cartContext;

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🛒</Text>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez des produits pour commencer
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {getTotalItems()} article{getTotalItems() > 1 ? "s" : ""}
        </Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Vider le panier</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items List */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={styles.name} numberOfLines={2}>
                {item.product.title}
              </Text>
              <Text style={styles.price}>
                {item.product.price.toFixed(2)} €
              </Text>

              {/* Quantity Controls */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemRight}>
              <Text style={styles.itemTotal}>
                {(item.product.price * item.quantity).toFixed(2)} €
              </Text>
              <TouchableOpacity
                onPress={() => removeFromCart(item.product.id)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeBtnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Footer with Total and Checkout */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{getTotalPrice().toFixed(2)} €</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => alert("Fonctionnalité à venir !")}
        >
          <Text style={styles.checkoutButtonText}>Commander</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  clearText: {
    fontSize: 14,
    color: "#e74c3c",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  // List
  listContainer: {
    padding: 16,
  },

  // Cart Item
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemLeft: {
    flex: 1,
    marginRight: 12,
  },
  itemRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    color: "#2ecc71",
    fontWeight: "bold",
    marginBottom: 12,
  },

  // Quantity Controls
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
  },

  // Item Total and Remove
  itemTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 12,
  },
  removeBtn: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Footer
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  checkoutButton: {
    backgroundColor: "#3498db",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
