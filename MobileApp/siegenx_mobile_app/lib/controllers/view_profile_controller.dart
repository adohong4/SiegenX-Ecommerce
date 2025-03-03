import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';

class ViewProfileController extends ChangeNotifier {
  String? username;
  String? email;
  bool isLoading = true;

  Future<void> fetchProfile(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;
    final String? initialEmail = authProvider.email;

    if (token == null) {
      isLoading = false;
      email = initialEmail ?? "N/A";
      username = "Không có tên";
      notifyListeners();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không có token được cung cấp')),
      );
      return;
    }

    print('Fetching profile with Token: $token'); // Debug token

    try {
      final response = await http.get(
        Uri.parse(ApiService.userProfile),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token', // Gửi token qua header Cookie đúng định dạng
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        username = data['metadata']['username'] ?? data['metadata']['email'];
        email = data['metadata']['email'];
        isLoading = false;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'])),
        );
      } else {
        isLoading = false;
        email = initialEmail ?? "N/A";
        username = "Không có tên";
        final data = jsonDecode(response.body);
        final errorMessage = data['message'] ?? 'Lỗi không xác định';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMessage)),
        );
      }
    } catch (e) {
      isLoading = false;
      email = initialEmail ?? "N/A";
      username = "Không có tên";
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: ${e.toString()}')),
      );
    }
    notifyListeners();
  }
}
