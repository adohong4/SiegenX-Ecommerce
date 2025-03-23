import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/cart_controller.dart'; // Import CartController
import 'package:siegenx_mobile_app/screens/cart/cart_main_screen.dart';
import 'package:siegenx_mobile_app/screens/home/banner_widget.dart';
import 'package:siegenx_mobile_app/screens/home/featured_products.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/number_cart_product.dart'; // Import hàm tính số lượng

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

  int _cartItemCount = 0; // Biến để lưu số lượng sản phẩm trong giỏ hàng

  @override
  void initState() {
    super.initState();
    _fetchCartItemCount(); // Lấy số lượng sản phẩm khi khởi tạo
  }

  Future<void> _fetchCartItemCount() async {
    try {
      final products = await CartController.fetchCartProducts(
          context); // Lấy danh sách sản phẩm
      setState(() {
        _cartItemCount =
            calculateCartItemCount(products); // Tính số lượng từ utils
      });
    } catch (e) {
      print('Error fetching cart items: $e');
      setState(() {
        _cartItemCount = 0; // Đặt về 0 nếu có lỗi
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        centerTitle: true, // Căn giữa logo
        title: Image.asset(
          'assets/logo.png', // Đường dẫn đến logo trong assets
          height: 40, // Chiều cao logo (có thể điều chỉnh)
          fit: BoxFit.contain, // Giữ tỷ lệ logo
        ),
        elevation: 0, // Bỏ bóng của AppBar nếu muốn phẳng
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
                  hintStyle: TextStyle(color: Colors.grey),
                  prefixIcon: Icon(Icons.search, color: AppColors.primaryColor),
                  filled: true,
                  fillColor: Color(0xFFF0F0F0),
                  contentPadding: EdgeInsets.symmetric(vertical: 12.0),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30.0),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),

            // Hiển thị banner
            BannerWidget(),

            SizedBox(height: 5),

            // Nội dung chính
            FeaturedProducts(),
          ],
        ),
      ),
    );
  }
}
