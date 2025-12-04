// Type pour un produit de l'API FakeStore
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
// Type pour un item dans le panier
export interface CartItem {
  product: Product;
  quantity: number;
}
// Type pour les catégories
export type Category = string;
