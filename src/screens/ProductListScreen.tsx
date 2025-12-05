// src/screens/ProductListScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product, Category } from "../types";
import { apiService } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

type Props = NativeStackScreenProps<RootStackParamList, "ProductList">;

export const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // Search
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sort
  const [sortBy, setSortBy] = useState<
    "none" | "price_asc" | "price_desc" | "rating"
  >("none");

  // Refresh
  const [refreshing, setRefreshing] = useState(false);

  const cartContext = useContext(CartContext);
  if (!cartContext)
    throw new Error("CartContext must be used within a CartProvider");
  const { getTotalItems } = cartContext; // Note: PDF uses getTotalItems, not getCartCount

  useEffect(() => {
    loadInitialProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    loadInitialProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadInitialProducts = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);

      const data =
        selectedCategory === "all"
          ? await apiService.getProducts(LIMIT, 1)
          : await apiService.getProductsByCategory(selectedCategory, LIMIT, 1);

      setProducts(data);
      setPage(1);
    } catch (err) {
      setError("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /** 🔥 Infinite Scroll Loader */
  const loadMoreProducts = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      const data =
        selectedCategory === "all"
          ? await apiService.getProducts(LIMIT, nextPage)
          : await apiService.getProductsByCategory(
              selectedCategory,
              LIMIT,
              nextPage
            );

      if (data.length > 0) {
        setProducts((prev) => [...prev, ...data]);
        setPage(nextPage);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  /** Refresh */
  const onRefresh = () => {
    setRefreshing(true);
    loadInitialProducts();
  };

  /** Filtrage Search */
  let filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /** Sorting */
  const sortProducts = (list: Product[]) => {
    switch (sortBy) {
      case "price_asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating.rate - a.rating.rate);
      default:
        return list;
    }
  };

  filteredProducts = sortProducts(filteredProducts);

  if (loading && products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boutique</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Favorites")}
            style={{ marginRight: 16 }}
          >
            <Text style={{ fontSize: 26 }}>❤️</Text>
          </TouchableOpacity>

          {/* 🛒 Cart with badge */}
          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <View>
              <Text style={{ fontSize: 26 }}>🛒</Text>

              {getTotalItems() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getTotalItems()}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Rechercher..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Sort */}
      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => setSortBy("none")}>
          <Text style={styles.sortText}>Défaut</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy("price_asc")}>
          <Text style={styles.sortText}>Prix ↑</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy("price_desc")}>
          <Text style={styles.sortText}>Prix ↓</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy("rating")}>
          <Text style={styles.sortText}>⭐ Note</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "all" && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory("all")}
        >
          <Text style={styles.categoryText}>Tous</Text>
        </TouchableOpacity>

        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.categoryButton,
              selectedCategory === c && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(c)}
          >
              
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate("ProductDetail", { productId: item.id })
            }
          />
        )}
        // 🔥 Infinite Scroll
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.2}
        // Pull to Refresh
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={() =>
          loadingMore && (
            <ActivityIndicator
              size="small"
              color="#3498db"
              style={{ marginVertical: 20 }}
            />
          )
        }
      />
    </SafeAreaView>
  );
};

/* ------------ Styles ------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },

  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  searchWrapper: { paddingHorizontal: 16, marginTop: 10 },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },

  sortContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 10,
    justifyContent: "space-between",
  },
  sortText: { fontSize: 14, color: "#3498db", fontWeight: "600" },

  categoriesContainer: {
    paddingVertical: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  categoryButtonActive: { backgroundColor: "#3498db" },
  categoryText: { color: "#000" },

  listContainer: { padding: 16 },
  row: { justifyContent: "space-between" },
});
