// src/screens/ProductDetailScreen.tsx
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Product } from "../types";
import { apiService } from "../services/api";
import { CartContext } from "../context/CartContext";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Safe context usage with null check
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartContext must be used within a CartProvider");
  }

  const { addToCart } = cartContext;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError("Unable to load product");
      console.error("loadProduct error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity); // Now this matches the updated CartContext
    Alert.alert(
      "Added to cart",
      `${product.title} x${quantity} added to cart.`
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {product.rating.rate}</Text>
            <Text style={styles.ratingCount}>
              ({product.rating.count} reviews)
            </Text>
          </View>

          <Text style={styles.price}>{product.price.toFixed(2)} €</Text>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyNumber}>{quantity}</Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>
            Add to cart — {product.price.toFixed(2)} €
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
  },
  content: { padding: 20 },
  category: {
    fontSize: 14,
    color: "#3498db",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: { fontSize: 16, marginRight: 8 },
  ratingCount: { fontSize: 14, color: "#666" },
  price: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 16,
  },
  descriptionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 22, color: "#333" },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  qtyNumber: { marginHorizontal: 12, fontSize: 18, fontWeight: "600" },
  addButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  errorText: { color: "#e74c3c", fontSize: 16, marginBottom: 12 },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3498db",
    borderRadius: 8,
  },
  retryButtonText: { color: "#fff", fontWeight: "600" },
});
