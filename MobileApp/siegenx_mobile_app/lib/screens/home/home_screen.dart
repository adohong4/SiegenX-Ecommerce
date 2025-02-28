import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/screens/cart/cart_main_screen.dart';
import 'package:siegenx_mobile_app/screens/home/banner_widget.dart';
import 'package:siegenx_mobile_app/screens/cart/cart_screen.dart';
import 'package:siegenx_mobile_app/screens/home/featured_products.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<String> bannerImages = [
    'assets/banner1.jpg',
    'assets/banner2.jpg',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text("Trang chủ"), // Tiêu đề bên trái
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart), // Icon giỏ hàng
            onPressed: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => CartMainScreen()));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Thanh tìm kiếm
            Padding(
              padding: EdgeInsets.all(10.0),
              child: TextField(
                decoration: InputDecoration(
                  hintText: "Tìm kiếm...",
                  hintStyle: TextStyle(color: Colors.grey), // Màu chữ gợi ý
                  prefixIcon: Icon(Icons.search,
                      color: AppColors.primaryColor), // Đổi màu icon
                  filled: true,
                  fillColor: Color(0xFFF0F0F0), // Màu nền trắng
                  contentPadding:
                      EdgeInsets.symmetric(vertical: 12.0), // Căn giữa nội dung
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30.0), // Bo góc tròn
                    borderSide: BorderSide.none, // Bỏ viền
                  ),
                ),
              ),
            ),

            // Hiển thị banner
            BannerWidget(),

            SizedBox(
              height: 5,
            ), // Nội dung chính
            FeaturedProducts(),
          ],
        ),
      ),
    );
  }
}
