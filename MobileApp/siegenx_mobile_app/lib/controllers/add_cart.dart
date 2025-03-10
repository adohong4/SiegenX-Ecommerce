import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:siegenx_mobile_app/services/api_service.dart';

class CartController {
  Future<bool> addToCart(String itemId) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiService.profile}/cart/add'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'itemId': itemId,
        }),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        print(data['message']); // "Thêm vào giỏ hàng thành công"
        return true;
      } else {
        throw Exception('Failed to add to cart: ${response.statusCode}');
      }
    } catch (e) {
      print('Error adding to cart: $e');
      return false;
    }
  }
}
