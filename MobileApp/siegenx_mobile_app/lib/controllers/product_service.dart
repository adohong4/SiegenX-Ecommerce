import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';

class ProductService {
  static Future<List<Product>> fetchAllProducts() async {
    final response = await http.get(Uri.parse(ApiService.getCampaignProducts));

    if (response.statusCode == 200 || response.statusCode == 201) {
      // Cho phép cả status 200 và 201
      final data = jsonDecode(response.body);
      // Sửa thành truy cập 'updatedProducts' trong 'metadata'
      final List<dynamic> productsJson = data['metadata']['updatedProducts'];
      return productsJson.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products: ${response.statusCode}');
    }
  }

  // Hàm mới để lấy dữ liệu giỏ hàng
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
}
