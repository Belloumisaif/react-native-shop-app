// App.tsx
import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { CartProvider } from "./src/context/CartContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </FavoritesProvider>
    </CartProvider>
  );
}
