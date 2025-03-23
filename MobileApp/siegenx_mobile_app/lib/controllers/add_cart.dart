import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart'; // Import AuthProvider

class AddCartController {
  static Future<void> addToCart(BuildContext context, String productId) async {
    try {
      // Lấy token từ AuthProvider
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = authProvider.token;

      if (token == null) {
        throw Exception('Bạn cần đăng nhập để thực hiện chức năng này');
      }

      // Gọi API
      final response = await http.post(
        Uri.parse(ApiService.addToCart),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
        body: jsonEncode({'itemId': productId}), // Sử dụng productId
      );

      // Xử lý response
      final responseBody = jsonDecode(response.body);

      if (response.statusCode == 201) {
        return;
      } else {
        // Lấy thông báo lỗi từ server hoặc mặc định
        final errorMessage = responseBody['message'] ??
            'Lỗi không xác định (Mã trạng thái: ${response.statusCode})';
        throw Exception(errorMessage);
      }
    } catch (e) {
      // Bắt lỗi mạng hoặc lỗi parse JSON
      throw Exception('Lỗi kết nối: ${e.toString()}');
    }
  }
}
