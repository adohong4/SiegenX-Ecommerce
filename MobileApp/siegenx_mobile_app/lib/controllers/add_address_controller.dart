import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/models/address_model.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';

class AddAddressController {
  Future<List<AddressModel>> fetchAddresses(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;

    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng đăng nhập để xem danh sách địa chỉ')),
      );
      return [];
    }

    try {
      final response = await http.get(
        Uri.parse(ApiService.listAddresses),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token', // Gửi token qua header Cookie đúng định dạng
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> addressList = data['metadata']['addresses'];
        return addressList.map((json) => AddressModel.fromJson(json)).toList();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  'Lỗi khi lấy danh sách địa chỉ: ${response.statusCode}')),
        );
        return [];
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: $e')),
      );
      return [];
    }
  }
}
