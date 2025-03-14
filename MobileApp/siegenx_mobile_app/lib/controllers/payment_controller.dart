// payment_controller.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:siegenx_mobile_app/services/api_service.dart';

class PaymentController {
  // Hàm gọi API đặt hàng COD
  static Future<Map<String, dynamic>> placeCodOrder({
    required String token,
    required Map<String, dynamic> orderData,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiService.codVerify),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
        body: jsonEncode(orderData),
      );

      // Debug phản hồi
      print('Place Order Response status: ${response.statusCode}');
      print('Place Order Response body: ${response.body}');

      if (response.statusCode == 201) {
        // Ép định dạng phản hồi đúng như yêu cầu
        return {
          'status': 201,
          'message':
              'Đơn hàng đã được đặt thành công, vui lòng thanh toán khi nhận hàng.',
          'data':
              jsonDecode(response.body), // Lưu dữ liệu gốc từ backend nếu cần
        };
      } else {
        final errorBody = jsonDecode(response.body);
        final errorMessage = errorBody['message'] ?? 'Đặt hàng thất bại';
        throw Exception(errorMessage);
      }
    } catch (e) {
      throw Exception('Lỗi khi gọi API: $e');
    }
  }
}
