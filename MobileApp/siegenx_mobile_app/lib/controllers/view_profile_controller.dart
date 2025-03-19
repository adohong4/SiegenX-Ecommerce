import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:intl/intl.dart'; // Thêm import này

class ViewProfileController extends ChangeNotifier {
  String? username;
  String? email;
  String? fullName;
  String? gender;
  String? numberPhone;
  String? dateOfBirth;
  String? profilePic; // Thêm biến profilePic
  bool isLoading = true;

  Future<void> fetchProfile(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;
    final String? initialEmail = authProvider.email;

    if (token == null) {
      isLoading = false;
      email = initialEmail ?? "N/A";
      username = "Không có tên";
      fullName = "N/A";
      gender = "N/A";
      numberPhone = "N/A";
      dateOfBirth = "N/A";
      profilePic = null; // Khởi tạo profilePic
      notifyListeners();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không có token được cung cấp')),
      );
      return;
    }

    print('Fetching profile with Token: $token');

    try {
      final response = await http.get(
        Uri.parse(ApiService.userProfile),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        username = data['metadata']['username'] ?? data['metadata']['email'];
        email = data['metadata']['email'];
        fullName = data['metadata']['fullName'] ?? "N/A";
        gender = data['metadata']['gender'] ?? "N/A";
        numberPhone = data['metadata']['numberPhone'] ?? "N/A";
        profilePic = data['metadata']['profilePic']; // Lấy profilePic từ API

        // Định dạng dateOfBirth
        String? rawDateOfBirth = data['metadata']['dateOfBirth'];
        if (rawDateOfBirth != null) {
          DateTime parsedDate = DateTime.parse(rawDateOfBirth);
          dateOfBirth = DateFormat('dd-MM-yyyy').format(parsedDate);
        } else {
          dateOfBirth = "N/A";
        }

        print('Username: $username');
        print('Email: $email');
        print('FullName: $fullName');
        print('Gender: $gender');
        print('NumberPhone: $numberPhone');
        print('DateOfBirth: $dateOfBirth');
        print('ProfilePic: $profilePic');

        isLoading = false;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'])),
        );
      } else {
        isLoading = false;
        email = initialEmail ?? "N/A";
        username = "Không có tên";
        fullName = "N/A";
        gender = "N/A";
        numberPhone = "N/A";
        dateOfBirth = "N/A";
        profilePic = null;
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
      fullName = "N/A";
      gender = "N/A";
      numberPhone = "N/A";
      dateOfBirth = "N/A";
      profilePic = null;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: ${e.toString()}')),
      );
    }
    notifyListeners();
  }
}
