import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../screens/manager_screen.dart'; // Màn hình sau khi đăng nhập thành công
import '../services/api_service.dart'; // Import đường dẫn API

class AuthController {
  static Future<void> login(
      BuildContext context, String email, String password) async {
    final url = Uri.parse(ApiService.login); // Sử dụng đường dẫn từ ApiService

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);
      final String message =
          data['message'] ?? "Lỗi không xác định"; // Lấy message từ API

      if (response.statusCode == 200) {
        final String token = data['metadata']['token']; // Lấy token từ response

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(message)), // Hiển thị message từ API
        );

        // Chuyển hướng đến màn hình chính
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => ManagerScreen()),
        );
      } else {
        // Hiển thị lỗi từ API nếu đăng nhập thất bại
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(message)), // Hiển thị message lỗi từ API
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: ${e.toString()}')),
      );
    }
  }
}
