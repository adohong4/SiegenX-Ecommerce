import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/screens/banner_widget.dart';

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
              // Thực hiện hành động khi bấm vào giỏ hàng
              print("Giỏ hàng được nhấn");
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Thanh tìm kiếm
          Padding(
            padding: EdgeInsets.all(10.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: "Tìm kiếm...",
                hintStyle: TextStyle(color: Colors.grey), // Màu chữ gợi ý
                prefixIcon: Icon(Icons.search,
                    color: Color(0xFF00B98E)), // Đổi màu icon
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

          // Nội dung chính
          Expanded(
            child: Center(
              child: Text("Nội dung chính", style: TextStyle(fontSize: 22)),
            ),
          ),
        ],
      ),
    );
  }
}
