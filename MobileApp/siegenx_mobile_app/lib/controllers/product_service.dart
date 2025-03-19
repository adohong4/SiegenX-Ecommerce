import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/widgets/product_detail.dart';

class ProductService {
  static Future<List<Product>> fetchAllProducts() async {
    final response = await http.get(Uri.parse(ApiService.getCampaignProducts));

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      final List<dynamic> productsJson = data['metadata']['updatedProducts'];
      return productsJson.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products: ${response.statusCode}');
    }
  }

  static Future<Map<String, int>> fetchCart(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;
    final response = await http.get(
      Uri.parse(ApiService.getCart),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'jwt=$token',
      },
    );
    if (response.statusCode == 200) {
      final data =
          jsonDecode(response.body)['metadata'] as Map<String, dynamic>;
      return data.map((key, value) => MapEntry(key, value as int));
    } else {
      throw Exception('Failed to load cart');
    }
  }

  static Future<void> fetchProductAndNavigate(
      BuildContext context, String productSlug) async {
    final url = "${ApiService.getProductBySlug}/$productSlug";
    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final jsonData = jsonDecode(response.body);
      debugPrint('Raw JSON Data: $jsonData'); // In toàn bộ dữ liệu thô
      final productData = jsonData['metadata']; // Get data from metadata
      final product = Product.fromJson(productData); // Parse the data

      debugPrint('Parsed Product: ${product.toString()}');
      debugPrint('Recap: ${product.recap}');
      debugPrint('Description: ${product.description}');

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ProductDetailScreen(product: product),
        ),
      );
    } else {
      debugPrint('Failed to load product: ${response.statusCode}');
      throw Exception(
          'Failed to load product with slug $productSlug: ${response.statusCode}');
    }
  }
}
