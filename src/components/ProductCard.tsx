// src/components/ProductCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Product } from "../types";
import { useFavorites } from "../context/FavoritesContext";

const { width } = Dimensions.get("window");

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoritePress = () => {
    toggleFavorite(product);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Favorite Button */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
      >
        <Text style={styles.favoriteIcon}>
          {isFavorite(product.id) ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>

      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>{product.price.toFixed(2)} €</Text>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>⭐ {product.rating.rate}</Text>
          <Text style={styles.ratingCount}>({product.rating.count})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: (width - 48) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    height: 40,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 4,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingText: {
    fontSize: 12,
  },
  ratingCount: {
    fontSize: 12,
    color: "#666",
  },
});
