class Product {
  final String name;
  final double price;
  final int discountPercentage;
  final double discountedPrice;
  final String description;
  final bool isFavorite;
  final String imageUrl;

  Product({
    required this.name,
    required this.price,
    required this.discountPercentage,
    required this.discountedPrice,
    required this.description,
    required this.isFavorite,
    required this.imageUrl,
  });
}
