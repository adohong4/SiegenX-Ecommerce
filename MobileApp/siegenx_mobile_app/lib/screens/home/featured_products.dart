import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/test/sample_products.dart';

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
                  // fontWeight: FontWeight.bold,
                ),
              ),
              // "Xem chi tiết" + Icon mũi tên
              Row(
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
            ],
          ),
        ),

        // Hiển thị danh sách sản phẩm (2 cột)
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.0), // Căn giữa danh sách
          child: GridView.count(
            crossAxisCount: 2, // 2 cột
            crossAxisSpacing: 16, // Khoảng cách giữa các cột
            mainAxisSpacing: 16, // Khoảng cách giữa các hàng
            shrinkWrap:
                true, // Để tránh lỗi "Vertical viewport was given unbounded height"
            physics:
                NeverScrollableScrollPhysics(), // Vô hiệu hóa cuộn bên trong
            children: List.generate(sampleProducts.length, (index) {
              final product = sampleProducts[index];
              return Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Hình ảnh sản phẩm
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      image: DecorationImage(
                        image: AssetImage(product.imageUrl),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  SizedBox(height: 5),
                  // Tên sản phẩm
                  Text(
                    product.name,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Colors.black,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                  // Giá sản phẩm
                  Text(
                    "${product.discountedPrice.toStringAsFixed(0)}đ",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              );
            }),
          ),
        ),
      ],
    );
  }
}
