import 'package:flutter/material.dart';
import 'cart_screen.dart';
import 'pending_screen.dart';
import 'preparing_screen.dart';
import 'shipping_screen.dart';
import 'delivered_screen.dart';

class CartMainScreen extends StatefulWidget {
  @override
  _CartMainScreenState createState() => _CartMainScreenState();
}

class _CartMainScreenState extends State<CartMainScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    CartScreen(), // Giỏ hàng
    PendingScreen(), // Chờ xác nhận
    PreparingScreen(), // Chuẩn bị đơn hàng
    ShippingScreen(), // Đang giao hàng
    DeliveredScreen(), // Giao hàng thành công
  ];

  final List<String> _iconNames = [
    "cart", // Giỏ hàng
    "pending", // Chờ xác nhận
    "preparing", // Chuẩn bị đơn hàng
    "shipping", // Đang giao hàng
    "delivered", // Giao hàng thành công
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
        title: Text("Đơn hàng của bạn",
            style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          SizedBox(height: 10), // Khoảng cách giữa tiêu đề và icon
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(_iconNames.length, (index) {
                return _buildNavItem(_iconNames[index], index);
              }),
            ),
          ),
          Divider(thickness: 1, color: Colors.grey[300]), // Đường kẻ phân cách
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
          Image.asset(imagePath, width: 26, height: 26),
          SizedBox(height: 10),
          Text(
            _getLabel(iconName),
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: _selectedIndex == index ? Color(0xFF00B98E) : Colors.black,
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
