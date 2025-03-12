class Product {
  final String id; // _id từ MongoDB
  final String title; // title từ backend
  final String nameProduct; // nameProduct từ backend
  final String? productSlug; // product_slug
  final double price; // price
  final double? newPrice; // Giá khuyến mãi từ API campaign
  final List<String> images; // images
  final String recap; // recap
  final String description; // description
  final String category; // category
  int quantity; // quantity
  final String? mainBoard; // mainBoard
  final String? chip; // chip
  final String? cpu; // cpu
  final String? gpu; // gpu
  final String? ram; // ram
  final String? memory; // memory
  final String? version; // version
  final String? ports; // ports
  final String? displaySize; // displaySize
  final String? pixelDensity; // pixelDensity
  final String? display; // display
  final String? refreshRate; // refreshRate
  final List<dynamic>?
      creator; // creator (mảng object, tùy thuộc vào HistorySchema)
  final bool active; // active
  final DateTime createdAt; // Từ timestamps
  final DateTime updatedAt; // Từ timestamps
  final bool isFavorite; // Trạng thái phía client

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
    this.isFavorite = false, // Mặc định false, không ánh xạ từ backend
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['_id'] as String? ??
          'unknown', // Giá trị mặc định nếu _id là null
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
      recap: json['recap'] as String? ?? '',
      description: json['description'] as String? ?? '',
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
