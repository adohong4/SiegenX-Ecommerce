import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/providers/favorites_provider.dart';
import 'package:siegenx_mobile_app/screens/manager_screen.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/widgets/custom_snackbar.dart';
import 'package:siegenx_mobile_app/widgets/success_animation.dart';

class AuthController {
  static Future<void> login(
    BuildContext context,
    String email,
    String password, {
    VoidCallback? onError, // Callback để xử lý lỗi từ bên ngoài
  }) async {
    final url = Uri.parse(ApiService.login);

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
      final String message = data['message'] ?? "Lỗi không xác định";

      if (response.statusCode == 200) {
        final String token = data['metadata']['token'];
        final String userId = data['metadata']['user']['id'];
        final String emailFromResponse = data['metadata']['user']['email'];

        // Lưu token và thông tin vào AuthProvider
        Provider.of<AuthProvider>(context, listen: false)
            .setAuthData(userId, token, email: emailFromResponse);

        // Tải danh sách yêu thích sau khi đăng nhập
        await Provider.of<FavoritesProvider>(context, listen: false)
            .loadFavorites(userId);

        print('Login Success - Token: $token');

        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => SuccessAnimation(
            onComplete: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => ManagerScreen()),
                (route) => false,
              );
            },
          ),
        );
      } else {
        CustomSnackBar.show(context, message, Icons.error, Colors.red);
      }
    } catch (e) {
      // Truyền lỗi ra ngoài qua callback thay vì dùng context trực tiếp
      if (onError != null) {
        onError();
      } else if (context.mounted) {
        // Kiểm tra context còn hợp lệ
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi kết nối: ${e.toString()}')),
        );
      }
    }
  }
}
