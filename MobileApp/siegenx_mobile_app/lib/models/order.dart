import 'package:siegenx_mobile_app/models/product.dart';

class Order {
  final String id;
  final String userId;
  final List<OrderItem> items;
  final double amount;
  final String status;
  final String paymentMethod;
  final bool payment;
  final bool statusActive;
  final String date;
  final Address? address;

  Order({
    required this.id,
    required this.userId,
    required this.items,
    required this.amount,
    required this.status,
    required this.paymentMethod,
    required this.payment,
    required this.statusActive,
    required this.date,
    this.address,
  });

  factory Order.fromJson(Map<String, dynamic> json, List<Product> products) {
    final itemsJson = json['items'] as List<dynamic>? ?? [];
    final items = itemsJson.map((itemJson) {
      final item = itemJson as Map<String, dynamic>;
      final productSlug = item['product_slug'] as String? ?? '';
      final product = products.firstWhere(
        (p) => p.productSlug == productSlug,
        orElse: () => Product(
          id: 'unknown',
          title: item['title'] ?? '',
          nameProduct: item['title'] ?? '',
          price: (item['price'] as num?)?.toDouble() ?? 0.0,
          images: (item['images'] as List<dynamic>?)
                  ?.map((e) => e as String)
                  .toList() ??
              [],
          recap: '',
          description: '',
          category: item['category'] ?? '',
          quantity: item['quantity'] ?? 1,
          active: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      );

      return OrderItem(
        id: item['_id'] ?? product.id,
        title: item['title'] ?? product.title,
        productSlug: productSlug,
        price: (item['price'] as num?)?.toDouble() ?? product.price,
        quantity: item['quantity'] as int? ?? 1,
        images: (item['images'] as List<dynamic>?)
                ?.map((e) => e as String)
                .toList() ??
            product.images,
        category: item['category'] ?? product.category,
      );
    }).toList();

    return Order(
      id: json['_id'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
      items: items,
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] as String? ?? '',
      paymentMethod: json['paymentMethod'] as String? ?? '',
      payment: json['payment'] as bool? ?? false,
      statusActive: json['statusActive'] as bool? ?? true,
      date: json['date'] as String? ?? '',
      address: json['address'] != null
          ? Address.fromJson(json['address'] as Map<String, dynamic>)
          : null,
    );
  }
}

class OrderItem {
  final String id;
  final String title;
  final String productSlug;
  final double price;
  final int quantity;
  final List<String> images;
  final String category;

  OrderItem({
    required this.id,
    required this.title,
    required this.productSlug,
    required this.price,
    required this.quantity,
    required this.images,
    required this.category,
  });
}

class Address {
  final String? fullname;
  final String? email;
  final String? phone;
  final String? street;
  final String? precinct;
  final String? city;
  final String? province;

  Address({
    this.fullname,
    this.email,
    this.phone,
    this.street,
    this.precinct,
    this.city,
    this.province,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      fullname: json['fullname'] as String?,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      street: json['street'] as String?,
      precinct: json['precinct'] as String?,
      city: json['city'] as String?,
      province: json['province'] as String?,
    );
  }
}
