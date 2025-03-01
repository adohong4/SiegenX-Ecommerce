import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/screens/manager_screen.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/widgets/custom_snackbar.dart';
import 'package:siegenx_mobile_app/widgets/success_animation.dart';
import '../screens/profile_screen.dart'; // Import ProfileScreen

class AuthController {
  static Future<void> login(
      BuildContext context, String email, String password) async {
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

        Provider.of<AuthProvider>(context, listen: false)
            .setAuthData(userId, token, email: emailFromResponse);

        print('Login Success - Token: $token');

        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => SuccessAnimation(
            onComplete: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(
                    builder: (context) =>
                        ManagerScreen()), // Chuyển sang ProfileScreen
                (route) => false,
              );
            },
          ),
        );
      } else {
        CustomSnackBar.show(context, message, Icons.error, Colors.red);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: ${e.toString()}')),
      );
    }
  }
}
