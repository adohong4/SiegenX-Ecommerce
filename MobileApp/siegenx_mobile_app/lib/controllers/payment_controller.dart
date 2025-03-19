import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/models/order.dart';

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

      print('Place Order Response status: ${response.statusCode}');
      print('Place Order Response body: ${response.body}');

      if (response.statusCode == 201) {
        return {
          'status': 201,
          'message':
              'Đơn hàng đã được đặt thành công, vui lòng thanh toán khi nhận hàng.',
          'data': jsonDecode(response.body),
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

  // Hàm lấy danh sách sản phẩm từ API /product/getAll
  static Future<List<Product>> getAllProducts(String token) async {
    try {
      final response = await http.get(
        Uri.parse(ApiService.getAllProducts),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
      );

      print('Get Products Response status: ${response.statusCode}');
      print('Get Products Response body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        final productsJson = jsonData['metadata'] as List<dynamic>? ?? [];
        return productsJson.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Lấy danh sách sản phẩm thất bại');
      }
    } catch (e) {
      throw Exception('Lỗi khi gọi API sản phẩm: $e');
    }
  }

  // Hàm lấy thông tin đơn hàng và bổ sung dữ liệu sản phẩm
  static Future<Map<String, dynamic>> getOrderDetails({
    required String token,
  }) async {
    try {
      // Lấy danh sách sản phẩm trước
      final products = await getAllProducts(token);

      // Lấy thông tin đơn hàng
      final response = await http.get(
        Uri.parse(ApiService.getOrder),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
      );

      print('Get Order Response status: ${response.statusCode}');
      print('Get Order Response body: ${response.body}');

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final ordersJson = responseData['metadata'] as List<dynamic>;
        final orders =
            ordersJson.map((json) => Order.fromJson(json, products)).toList();

        return {
          'status': 200,
          'message': 'Lấy thông tin đơn hàng thành công',
          'metadata': orders
              .map((order) => {
                    '_id': order.id,
                    'userId': order.userId,
                    'items': order.items
                        .map((item) => {
                              '_id': item.id, // Đảm bảo có _id
                              'title': item.title,
                              'product_slug': item.productSlug,
                              'price': item.price,
                              'quantity': item.quantity,
                              'images': item.images, // Đảm bảo có images
                              'category': item.category,
                            })
                        .toList(),
                    'amount': order.amount,
                    'status': order.status,
                    'paymentMethod': order.paymentMethod,
                    'payment': order.payment,
                    'statusActive': order.statusActive,
                    'date': order.date,
                  })
              .toList(),
        };
      } else {
        final errorBody = jsonDecode(response.body);
        final errorMessage = errorBody['message'] ?? 'Lấy đơn hàng thất bại';
        throw Exception(errorMessage);
      }
    } catch (e) {
      throw Exception('Lỗi khi gọi API lấy đơn hàng: $e');
    }
  }
}
