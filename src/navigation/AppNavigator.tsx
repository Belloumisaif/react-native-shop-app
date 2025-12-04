// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProductListScreen } from "../screens/ProductListScreen";
import { ProductDetailScreen } from "../screens/ProductDetailScreen";
import { CartScreen } from "../screens/CartScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number };
  Cart: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ProductList"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ headerShown: true, title: "Product Details" }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ headerShown: true, title: "Cart" }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ headerShown: true, title: "Favorites" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
