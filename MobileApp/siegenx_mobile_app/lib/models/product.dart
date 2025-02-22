class Product {
  final int id; // ✅ ID sản phẩm
  final String name;
  final double price;
  final int discountPercentage;
  final String description;
  final bool isFavorite;
  final String imageUrl;
  int quantity; // ✅ Số lượng sản phẩm trong giỏ hàng

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.discountPercentage,
    required this.description,
    required this.isFavorite,
    required this.imageUrl,
    this.quantity = 1, // Mặc định là 1 khi thêm vào giỏ hàng
  });

  // ✅ Hàm tính toán giá sau khi giảm
  double get discountedPrice {
    return price * (1 - discountPercentage / 100);
  }

  void get isInCart => null;
}
