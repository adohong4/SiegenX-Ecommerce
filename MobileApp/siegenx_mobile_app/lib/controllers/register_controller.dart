// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import '../services/api_service.dart';

// class RegisterController {
//   Future<Map<String, dynamic>> registerUser({
//     required String username,
//     required String email,
//     required String password,
//   }) async {
//     try {
//       final response = await http.post(
//         Uri.parse(ApiService.register),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: jsonEncode({
//           'username': username,
//           'email': email,
//           'password': password,
//         }),
//       );

//       final responseData = jsonDecode(response.body);

//       if (response.statusCode == 201) {
//         return {
//           'success': true,
//           'data': responseData,
//           'message': responseData['message'],
//         };
//       } else {
//         return {
//           'success': false,
//           'message': responseData['message'] ?? 'Đăng ký thất bại',
//         };
//       }
//     } catch (e) {
//       return {
//         'success': false,
//         'message': 'Lỗi kết nối: $e',
//       };
//     }
//   }
// }

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../services/api_service.dart';

class RegisterController {
  Future<Map<String, dynamic>> registerUser({
    required String username,
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiService.register),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'username': username,
          'email': email,
          'password': password,
        }),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 201) {
        // Lấy token từ metadata (dựa trên response của bạn)
        String token = responseData['metadata']['token'];
        return {
          'success': true,
          'data': responseData,
          'token': token, // Thêm token để truyền sang màn hình tiếp theo
          'message': responseData['message'],
        };
      } else {
        return {
          'success': false,
          'message': responseData['message'] ?? 'Đăng ký thất bại',
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
