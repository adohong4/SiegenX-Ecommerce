import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'dart:convert';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/models/product.dart';

class CartController {
  static Future<Map<String, int>> fetchCartData(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;
    if (token == null || token.isEmpty) {
      throw Exception('No token available');
    }

    try {
      final response = await http.get(
        Uri.parse(ApiService.getCart),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final cartData = data['metadata'] as Map<String, dynamic>;
        print('Cart Data: $cartData');
        return cartData.map((key, value) => MapEntry(key, value as int));
      } else {
        throw Exception('Failed to load cart data: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching cart data: $e');
    }
  }

  static Future<List<Product>> fetchCampaignProducts(
      BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;
    if (token == null || token.isEmpty) {
      throw Exception('No token available');
    }

    try {
      final response = await http.get(
        Uri.parse(ApiService.getCampaignProducts),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> productData = data['metadata']['updatedProducts'];
        final products =
            productData.map((json) => Product.fromJson(json)).toList();
        print('Campaign Products IDs: ${products.map((p) => p.id).toList()}');
        return products;
      } else {
        throw Exception(
            'Failed to load campaign products: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching campaign products: $e');
    }
  }

  static Future<List<Product>> fetchCartProducts(BuildContext context) async {
    try {
      final cartData = await fetchCartData(context);
      final campaignProducts = await fetchCampaignProducts(context);

      // Kiểm tra sự khớp nối
      final cartIds = cartData.keys.toSet();
      final campaignIds = campaignProducts.map((p) => p.id).toSet();
      print('Cart IDs: $cartIds');
      print('Campaign IDs: $campaignIds');
      print('Matched IDs: ${cartIds.intersection(campaignIds)}');

      // Lọc sản phẩm khớp với cartData
      final List<Product> cartProducts = campaignProducts
          .where((product) {
            final isMatch = cartData.containsKey(product.id);
            if (isMatch) {
              print(
                  'Matched product: ${product.id} - ${product.nameProduct} with quantity ${cartData[product.id]}');
            }
            return isMatch;
          })
          .map((product) => product.copyWith(
                quantity: cartData[product.id] ?? 0,
                price: product.newPrice ?? product.price,
              ))
          .toList();

      print('Cart Products: ${cartProducts.length} items');
      if (cartProducts.isEmpty) {
        print('No matching products found between cart and campaign data');
      }
      return cartProducts;
    } catch (e) {
      print('Error in fetchCartProducts: $e');
      throw Exception('Error fetching cart products: $e');
    }
  }
}
