import '../models/product.dart';

List<Product> sampleProducts = [
  Product(
    name: "Giày Nike Air Max",
    price: 2000000,
    discountPercentage: 20,
    discountedPrice: 1600000,
    description: "Giày thể thao chính hãng Nike.",
    isFavorite: true,
    imageUrl: "assets/google.png",
  ),
  Product(
    name: "Áo Hoodie Adidas",
    price: 1200000,
    discountPercentage: 15,
    discountedPrice: 1020000,
    description: "Áo hoodie phong cách thể thao.",
    isFavorite: false,
    imageUrl: "assets/apple.png",
  ),
  Product(
    name: "MacBook Pro M2",
    price: 35000000,
    discountPercentage: 10,
    discountedPrice: 31500000,
    description: "Laptop mạnh mẽ cho công việc và giải trí.",
    isFavorite: true,
    imageUrl: "assets/facebook.png",
  ),
];
