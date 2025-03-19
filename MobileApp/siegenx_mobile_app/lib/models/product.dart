class Product {
  final String id;
  final String title;
  final String nameProduct;
  final String? productSlug;
  final double price;
  final double? newPrice;
  final List<String> images;
  final String recap;
  final String description;
  final String category;
  int quantity;
  final String? mainBoard;
  final String? chip;
  final String? cpu;
  final String? gpu;
  final String? ram;
  final String? memory;
  final String? version;
  final String? ports;
  final String? displaySize;
  final String? pixelDensity;
  final String? display;
  final String? refreshRate;
  final List<dynamic>? creator;
  final bool active;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isFavorite;

  Product({
    required this.id,
    required this.title,
    required this.nameProduct,
    this.productSlug,
    required this.price,
    this.newPrice,
    required this.images,
    required this.recap,
    required this.description,
    required this.category,
    required this.quantity,
    this.mainBoard,
    this.chip,
    this.cpu,
    this.gpu,
    this.ram,
    this.memory,
    this.version,
    this.ports,
    this.displaySize,
    this.pixelDensity,
    this.display,
    this.refreshRate,
    this.creator,
    required this.active,
    required this.createdAt,
    required this.updatedAt,
    this.isFavorite = false,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['_id'] as String? ?? 'unknown',
      title: json['title'] as String? ?? '',
      nameProduct: json['nameProduct'] as String? ?? '',
      productSlug: json['product_slug'] as String?,
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      newPrice: json['newPrice'] != null
          ? (json['newPrice'] as num).toDouble()
          : null,
      images: json['images'] != null
          ? List<String>.from(json['images'] as List)
          : [],
      recap: json['recap'] as String? ?? '', // Đảm bảo recap được ánh xạ
      description: json['description'] as String? ??
          '', // Đảm bảo description được ánh xạ
      category: json['category'] as String? ?? '',
      quantity: (json['quantity'] as num?)?.toInt() ?? 0,
      mainBoard: json['mainBoard'] as String?,
      chip: json['chip'] as String?,
      cpu: json['cpu'] as String?,
      gpu: json['gpu'] as String?,
      ram: json['ram'] as String?,
      memory: json['memory'] as String?,
      version: json['version'] as String?,
      ports: json['ports'] as String?,
      displaySize: json['displaySize'] as String?,
      pixelDensity: json['pixelDensity'] as String?,
      display: json['display'] as String?,
      refreshRate: json['refreshRate'] as String?,
      creator: json['creator'] as List<dynamic>?,
      active: json['active'] as bool? ?? true,
      createdAt: DateTime.parse(
          json['createdAt'] as String? ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(
          json['updatedAt'] as String? ?? DateTime.now().toIso8601String()),
    );
  }

  Product copyWith({
    int? quantity,
    double? price,
    double? newPrice,
    bool? isFavorite,
  }) {
    return Product(
      id: this.id,
      title: this.title,
      nameProduct: this.nameProduct,
      productSlug: this.productSlug,
      price: price ?? this.price,
      newPrice: newPrice ?? this.newPrice,
      images: this.images,
      recap: this.recap,
      description: this.description,
      category: this.category,
      quantity: quantity ?? this.quantity,
      mainBoard: this.mainBoard,
      chip: this.chip,
      cpu: this.cpu,
      gpu: this.gpu,
      ram: this.ram,
      memory: this.memory,
      version: this.version,
      ports: this.ports,
      displaySize: this.displaySize,
      pixelDensity: this.pixelDensity,
      display: this.display,
      refreshRate: this.refreshRate,
      creator: this.creator,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}
