import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';

class ProductService {
  // Lấy tất cả sản phẩm từ API getAll
  static Future<List<Product>> fetchAllProducts() async {
    final response = await http.get(Uri.parse(ApiService.getAllProducts));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final List<dynamic> productsJson = data['metadata'];
      return productsJson.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products');
    }
  }
}
