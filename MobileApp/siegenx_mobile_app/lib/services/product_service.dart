import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:siegenx_mobile_app/models/product.dart';
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
}
