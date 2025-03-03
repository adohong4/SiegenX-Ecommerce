class Product {
  final int id;
  final String name;
  final int price; // Giá hiện tại
  final String description;
  final bool isFavorite;
  final List<String> imageUrl;
  final int quantity; // Số lượng hàng

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.description,
    required this.isFavorite,
    required this.imageUrl,
    required this.quantity, // Đổi thành required vì luôn có trong API getAll
  });

  // Factory constructor để parse JSON
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: int.parse(json['_id'].substring(0, 8), radix: 16),
      name: json['title'] as String,
      price: (json['price'] as num).round(), // Giá hiện tại
      description: json['title'] as String,
      isFavorite: false,
      imageUrl: List<String>.from(json['images'] as List),
      quantity: json['quantity'] as int, // Lấy số lượng từ API
    );
  }
}
