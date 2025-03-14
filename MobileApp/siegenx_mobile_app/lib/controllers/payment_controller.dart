// payment_controller.dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:siegenx_mobile_app/services/api_service.dart'; // Import ApiService để lấy endpoint

class PaymentController {
  // Hàm gọi API đặt hàng COD
  static Future<Map<String, dynamic>> placeCodOrder({
    required String token,
    required Map<String, dynamic> orderData,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiService.codVerify), // Sử dụng endpoint từ ApiService
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token', // Gửi token trong cookie
        },
        body: jsonEncode(orderData),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Đặt hàng thất bại: ${response.body}');
      }
    } catch (e) {
      throw Exception('Lỗi khi gọi API: $e');
    }
  }
}
