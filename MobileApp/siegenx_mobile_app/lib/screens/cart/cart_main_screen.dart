import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/screens/cart/cart_screen.dart';
import 'package:siegenx_mobile_app/screens/cart/pending_screen.dart';
import 'package:siegenx_mobile_app/screens/cart/preparing_screen.dart';
import 'package:siegenx_mobile_app/screens/cart/shipping_screen.dart';
import 'package:siegenx_mobile_app/screens/cart/delivered_screen.dart';

class CartMainScreen extends StatefulWidget {
  @override
  _CartMainScreenState createState() => _CartMainScreenState();
}

class _CartMainScreenState extends State<CartMainScreen> {
  int _selectedIndex = 0;
  int _cartItemCount = 0;
  late List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      CartScreen(
        onCartCountUpdated: (count) {
          setState(() {
            _cartItemCount = count;
          });
        },
      ),
      PendingScreen(),
      PreparingScreen(),
      ShippingScreen(),
      DeliveredScreen(),
    ];
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
        title: Text(
          "Đơn hàng của bạn",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          SizedBox(height: 10),
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
                    padding: EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    constraints: BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      '$_cartItemCount',
                      style: TextStyle(
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
