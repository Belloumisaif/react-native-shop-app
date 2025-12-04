import React from 'react';
import {
View,
Text,
Image,
StyleSheet,
TouchableOpacity,
} from 'react-native';
import { CartItem as CartItemType } from '../types';
interface CartItemProps {
item: CartItemType;
onUpdateQuantity: (quantity: number) => void;
onRemove: () => void;
}
export const CartItem: React.FC<CartItemProps> = ({
item,
onUpdateQuantity,
onRemove,
}) => {
const { product, quantity } = item;
return (
<View style={styles.container}>
<Image source={{ uri: product.image }} style={styles.image} />
<View style={styles.info}>
<Text style={styles.title} numberOfLines={2}>
{product.title}
</Text>
<Text style={styles.price}>{product.price.toFixed(2)} €</Text>
<View style={styles.quantityContainer}>
    <TouchableOpacity
style={styles.quantityButton}
onPress={() => onUpdateQuantity(quantity - 1)}
>
<Text style={styles.quantityButtonText}>-</Text>
</TouchableOpacity>
<Text style={styles.quantity}>{quantity}</Text>
<TouchableOpacity
style={styles.quantityButton}
onPress={() => onUpdateQuantity(quantity + 1)}
>
<Text style={styles.quantityButtonText}>+</Text>
</TouchableOpacity>
</View>
</View>
<TouchableOpacity style={styles.removeButton} onPress={onRemove}>
<Text style={styles.removeButtonText}>🗑️</Text>
</TouchableOpacity>
</View>
);
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 8,
  },
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
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
  },
});