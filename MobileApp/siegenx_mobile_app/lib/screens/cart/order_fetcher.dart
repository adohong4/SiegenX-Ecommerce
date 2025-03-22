import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:siegenx_mobile_app/models/product.dart';
import 'dart:convert';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/models/order.dart';
import 'pending_screen.dart';

class OrderFetcher extends StatefulWidget {
  const OrderFetcher({super.key});

  @override
  State<OrderFetcher> createState() => _OrderFetcherState();
}

class _OrderFetcherState extends State<OrderFetcher> {
  late Future<List<Order>> futureOrders;

  @override
  void initState() {
    super.initState();
    futureOrders = fetchOrders();
  }

  Future<List<Order>> fetchOrders() async {
    final response = await http.get(Uri.parse(ApiService.getOrder));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final List<dynamic> ordersJson = data['metadata'];
      // Giả sử bạn có danh sách products để map với items
      final List<Product> products = []; // Cần fetch từ API khác nếu có
      return ordersJson.map((json) => Order.fromJson(json, products)).toList();
    } else {
      throw Exception('Failed to load orders');
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Order>>(
      future: futureOrders,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return PendingScreen(orders: snapshot.data!);
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }
        return const Center(child: CircularProgressIndicator());
      },
    );
  }
}
