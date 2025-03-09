class Product {
  final int id;
  final String name;
  final int price;
  final int? newPrice; // Thêm trường mới này
  final String description;
  final bool isFavorite;
  final List<String> imageUrl;
  final int quantity;

  Product({
    required this.id,
    required this.name,
    required this.price,
    this.newPrice, // Thêm vào constructor
    required this.description,
    required this.isFavorite,
    required this.imageUrl,
    required this.quantity,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: int.parse(json['_id'].substring(0, 8), radix: 16),
      name: json['title'] as String,
      price: (json['price'] as num).round(),
      newPrice: json['newPrice'] != null
          ? (json['newPrice'] as num).round()
          : null, // Xử lý giá mới
      description: json['title'] as String,
      isFavorite: false,
      imageUrl: List<String>.from(json['images'] as List),
      quantity: json['quantity'] as int,
    );
  }
}
