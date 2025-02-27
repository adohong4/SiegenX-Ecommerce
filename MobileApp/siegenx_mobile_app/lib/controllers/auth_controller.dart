import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/widgets/custom_snackbar.dart';
import 'package:siegenx_mobile_app/widgets/success_animation.dart';
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
        final String token = data['metadata']['token'];

        // Hiển thị animation thành công
        showDialog(
          context: context,
          barrierDismissible:
              false, // Không cho tắt dialog bằng cách click bên ngoài
          builder: (context) => SuccessAnimation(
            onComplete: () {
              // Khi animation hoàn tất, chuyển sang ManagerScreen
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => ManagerScreen()),
                (route) => false,
              );
            },
          ),
        );
      } else {
        // ❌ Gọi CustomSnackBar (Lỗi đăng nhập)
        CustomSnackBar.show(context, message, Icons.error, Colors.red);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: ${e.toString()}')),
      );
    }
  }
}
