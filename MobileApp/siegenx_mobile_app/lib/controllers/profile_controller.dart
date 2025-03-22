import 'dart:convert';
import 'package:http/http.dart' as http;
import '../services/api_service.dart';

class ProfileController {
  Future<Map<String, dynamic>> updateProfile({
    required String token,
    required String fullName,
    required String dateOfBirth,
    required String numberPhone,
    required String gender,
  }) async {
    try {
      final response = await http.put(
        Uri.parse(ApiService.updateProfile),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token', // Gửi token qua cookie
        },
        body: jsonEncode({
          'fullName': fullName,
          'dateOfBirth': dateOfBirth,
          'numberPhone': numberPhone,
          'gender': gender,
        }),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {
          'success': true,
          'data': responseData,
          'message': responseData['message'],
        };
      } else {
        return {
          'success': false,
          'message': responseData['message'] ?? 'Cập nhật thất bại',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Lỗi kết nối: $e',
      };
    }
  }
}
