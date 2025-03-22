import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';

class DeleteAddressController {
  Future<bool> deleteAddress(BuildContext context, String addressId) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;

    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng đăng nhập để xóa địa chỉ')),
      );
      return false;
    }

    try {
      final response = await http.delete(
        Uri.parse('${ApiService.deleteAddress}/$addressId'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token', // Gửi token qua header Cookie đúng định dạng
        },
      );

      print('Delete Address status: ${response.statusCode}');
      print('Delete Address body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'])),
        );
        return true; // Thành công
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Lỗi khi xóa địa chỉ: ${response.statusCode}')),
        );
        return false; // Thất bại
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: $e')),
      );
      return false; // Thất bại
    }
  }
}
