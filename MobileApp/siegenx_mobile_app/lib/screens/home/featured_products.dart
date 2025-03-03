import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/screens/all_products.dart';
import 'package:siegenx_mobile_app/widgets/product_grid.dart';

class FeaturedProducts extends StatelessWidget {
  const FeaturedProducts({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start, // Căn tiêu đề sát lề trái
      children: [
        // Tiêu đề "Sản phẩm nổi bật" + "Xem chi tiết"
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween, // Đưa về 2 bên
            children: [
              // Tiêu đề
              Text(
                "Sản phẩm Nổi Bật",
                style: TextStyle(
                  fontSize: 16,
                ),
              ),

              // "Xem chi tiết" + Icon mũi tên (thêm GestureDetector để điều hướng)
              GestureDetector(
                onTap: () {
                  // Điều hướng sang màn hình chi tiết sản phẩm
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => AllProducts(),
                    ),
                  );
                },
                child: Row(
                  children: [
                    Text(
                      "Xem chi tiết",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF00B98E), // Màu xanh
                      ),
                    ),
                    SizedBox(width: 5),
                    Icon(Icons.arrow_forward,
                        size: 16, color: Color(0xFF00B98E)), // Mũi tên
                  ],
                ),
              ),
            ],
          ),
        ),

        // Gọi Widget danh sách sản phẩm
        SingleChildScrollView(
          child: Column(
            children: [
              ProductGrid(),
            ],
          ),
        )
      ],
    );
  }
}
