// src/services/api.ts
import { Product, Category } from "../types";

const BASE_URL = "https://fakestoreapi.com";

export const apiService = {
  /** Récupérer tous les produits avec limit & page */
  async getProducts(limit: number = 10, page: number = 1): Promise<Product[]> {
    try {
      const start = (page - 1) * limit;
      const response = await fetch(`${BASE_URL}/products?limit=${limit}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des produits");
      }

      const data = await response.json();

      // FakeStore API doesn't support pagination → simulate manually
      return data.slice(start, start + limit);
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },

  /** Récupérer toutes les catégories */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },

  /** Récupérer les produits d'une catégorie */
  async getProductsByCategory(
    category: string,
    limit: number = 10,
    page: number = 1
  ): Promise<Product[]> {
    try {
      const start = (page - 1) * limit;
      const response = await fetch(`${BASE_URL}/products/category/${category}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des produits");
      }

      const data = await response.json();

      return data.slice(start, start + limit);
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },

  /** Récupérer un seul produit */
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du produit");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },
};
