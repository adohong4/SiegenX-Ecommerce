class Product {
  final String name;
  final double price;
  final int discountPercentage;
  final String description;
  final bool isFavorite;
  final String imageUrl;

  Product({
    required this.name,
    required this.price,
    required this.discountPercentage,
    required this.description,
    required this.isFavorite,
    required this.imageUrl,
  });

  // ✅ Hàm tính toán giá sau khi giảm
  double get discountedPrice {
    return price * (1 - discountPercentage / 100);
  }
}
