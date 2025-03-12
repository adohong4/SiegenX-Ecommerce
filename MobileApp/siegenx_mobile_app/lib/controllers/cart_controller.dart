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

      final cartIds = cartData.keys.toSet();
      final campaignIds = campaignProducts.map((p) => p.id).toSet();
      print('Cart IDs: $cartIds');
      print('Campaign IDs: $campaignIds');
      print('Matched IDs: ${cartIds.intersection(campaignIds)}');

      final List<Product> cartProducts = campaignProducts
          .where((product) {
            final isMatch = cartData.containsKey(product.id);
            final quantity = cartData[product.id] ?? 0;
            if (isMatch && quantity >= 1) {
              print(
                  'Matched product: ${product.id} - ${product.nameProduct} with quantity $quantity');
              return true;
            }
            return false;
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

  // Xóa toàn bộ số lượng sản phẩm
  static Future<void> removeProductFromCart(
      BuildContext context, String productId, int currentQuantity) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;
    if (token == null || token.isEmpty) {
      throw Exception('No token available');
    }

    try {
      for (int i = 0; i < currentQuantity; i++) {
        final response = await http.post(
          Uri.parse(ApiService.removeFromCart),
          headers: {
            'Content-Type': 'application/json',
            'Cookie': 'jwt=$token',
          },
          body: jsonEncode({'itemId': productId}),
        );

        if (response.statusCode != 200) {
          throw Exception(
              'Failed to remove product from cart on iteration $i: ${response.statusCode}');
        }
      }
      print('Product $productId removed completely (quantity set to 0)');
    } catch (e) {
      throw Exception('Error removing product from cart: $e');
    }
  }

  // Thêm một sản phẩm vào giỏ hàng
  static Future<void> addProductToCart(
      BuildContext context, String productId) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;
    if (token == null || token.isEmpty) {
      throw Exception('No token available');
    }

    try {
      final response = await http.post(
        Uri.parse(ApiService.addToCart),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
        body: jsonEncode({'itemId': productId}),
      );

      // Chấp nhận cả 200 và 201 là thành công
      if (response.statusCode == 200 || response.statusCode == 201) {
        print('Product $productId added to cart successfully');
      } else {
        throw Exception(
            'Failed to add product to cart: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error adding product to cart: $e');
    }
  }

  // Giảm một sản phẩm khỏi giỏ hàng
  static Future<void> removeOneProductFromCart(
      BuildContext context, String productId) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;
    if (token == null || token.isEmpty) {
      throw Exception('No token available');
    }

    try {
      final response = await http.post(
        Uri.parse(ApiService.removeFromCart),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
        body: jsonEncode({'itemId': productId}),
      );

      if (response.statusCode == 200) {
        print('One unit of product $productId removed from cart successfully');
      } else {
        throw Exception(
            'Failed to remove one product from cart: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error removing one product from cart: $e');
    }
  }
}
