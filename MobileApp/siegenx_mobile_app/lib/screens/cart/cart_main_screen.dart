import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'dart:convert';
import 'package:siegenx_mobile_app/screens/cart/cart_screen.dart';
import 'package:siegenx_mobile_app/screens/cart/pending_screen.dart';
import 'package:siegenx_mobile_app/screens/cart/preparing_screen.dart';
import 'package:siegenx_mobile_app/screens/cart/shipping_screen.dart';
import 'package:siegenx_mobile_app/screens/cart/delivered_screen.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/models/order.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart'; // Thêm import

class CartMainScreen extends StatefulWidget {
  @override
  _CartMainScreenState createState() => _CartMainScreenState();
}

class _CartMainScreenState extends State<CartMainScreen> {
  int _selectedIndex = 0;
  int _cartItemCount = 0;
  late List<Widget> _screens;
  late Future<List<Order>> _futureOrders;

  @override
  void initState() {
    super.initState();
    _futureOrders = _fetchOrders();
    _screens = [
      CartScreen(
        onCartCountUpdated: (count) {
          setState(() {
            _cartItemCount = count;
          });
        },
      ),
      FutureBuilder<List<Order>>(
        future: _futureOrders,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final orders = snapshot.data!;
            return PendingScreen(
              orders: orders
                  .where((order) => order.status == 'Đợi xác nhận')
                  .toList(),
            );
          } else if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
      FutureBuilder<List<Order>>(
        future: _futureOrders,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final orders = snapshot.data!;
            return PreparingScreen(
              orders: orders
                  .where((order) => order.status == 'Đang chuẩn bị hàng')
                  .toList(),
            );
          } else if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
      FutureBuilder<List<Order>>(
        future: _futureOrders,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final orders = snapshot.data!;
            return ShippingScreen(
              orders: orders
                  .where((order) => order.status == 'Đang giao hàng')
                  .toList(),
            );
          } else if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
      FutureBuilder<List<Order>>(
        future: _futureOrders,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final orders = snapshot.data!;
            return DeliveredScreen(
              orders: orders
                  .where((order) => order.status == 'Giao hàng thành công')
                  .toList(),
            );
          } else if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
    ];
  }

  Future<List<Order>> _fetchOrders() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;

    if (token == null || token.isEmpty) {
      throw Exception('No token available. Please log in.');
    }

    // Bước 1: Lấy danh sách đơn hàng của người dùng hiện tại
    final response = await http.get(
      Uri.parse(ApiService.getOrder), // /profile/user/order/get
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'jwt=$token',
      },
    );

    if (response.statusCode != 200) {
      throw Exception(
          'Failed to load orders from getOrder: ${response.statusCode} - ${response.body}');
    }

    final data = jsonDecode(response.body);
    final List<dynamic> ordersJson = data['metadata'];
    final List<Order> orders = [];
    final List<Product> products = []; // Nếu cần bổ sung thông tin sản phẩm

    // Bước 2: Lấy chi tiết từng đơn hàng để bổ sung address
    for (var orderJson in ordersJson) {
      final orderId = orderJson['_id'] as String;
      final detailResponse = await http.get(
        Uri.parse(
            '${ApiService.getOrderDetails}/$orderId'), // /profile/order/get/{orderId}
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token',
        },
      );

      if (detailResponse.statusCode == 200) {
        final detailData = jsonDecode(detailResponse.body);
        final detailedOrderJson =
            detailData['metadata'] as Map<String, dynamic>;
        // Kết hợp dữ liệu từ API getOrder và getOrderDetails
        final combinedJson = {
          ...orderJson as Map<String, dynamic>,
          'address': detailedOrderJson['address'],
        };
        print('Combined JSON for order $orderId: $combinedJson'); // Debug
        orders.add(Order.fromJson(combinedJson, products));
      } else {
        // Nếu không lấy được chi tiết, vẫn thêm đơn hàng từ API đầu tiên (không có address)
        print(
            'Failed to fetch details for order $orderId: ${detailResponse.body}');
        orders.add(Order.fromJson(orderJson as Map<String, dynamic>, products));
      }
    }

    return orders;
  }

  final List<String> _iconNames = [
    "cart",
    "pending",
    "preparing",
    "shipping",
    "delivered",
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Đơn hàng của bạn",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(_iconNames.length, (index) {
                return _buildNavItem(_iconNames[index], index);
              }),
            ),
          ),
          Divider(thickness: 1, color: Colors.grey[300]),
          Expanded(child: _screens[_selectedIndex]),
        ],
      ),
    );
  }

  Widget _buildNavItem(String iconName, int index) {
    String imagePath =
        "assets/icons/${iconName}_${_selectedIndex == index ? '1' : '2'}.png";

    return GestureDetector(
      onTap: () => _onItemTapped(index),
      child: Column(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Image.asset(imagePath, width: 26, height: 26),
              if (iconName == "cart" && _cartItemCount > 0)
                Positioned(
                  right: -8,
                  top: -8,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      '$_cartItemCount',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            _getLabel(iconName),
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: _selectedIndex == index
                  ? const Color(0xFF00B98E)
                  : Colors.black,
            ),
          ),
        ],
      ),
    );
  }

  String _getLabel(String iconName) {
    switch (iconName) {
      case "cart":
        return "Giỏ hàng";
      case "pending":
        return "Chờ xác nhận";
      case "preparing":
        return "Chuẩn bị";
      case "shipping":
        return "Đang giao";
      case "delivered":
        return "Đã nhận hàng";
      default:
        return "";
    }
  }
}
