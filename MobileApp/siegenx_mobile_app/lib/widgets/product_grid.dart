import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/test/sample_products.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';

class ProductGrid extends StatelessWidget {
  const ProductGrid({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.0),
      child: LayoutBuilder(
        builder: (context, constraints) {
          int crossAxisCount = (constraints.maxWidth ~/ 150).clamp(2, 4);

          return GridView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: crossAxisCount,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 0.8,
            ),
            itemCount: sampleProducts.length,
            itemBuilder: (context, index) {
              final product = sampleProducts[index];
              return Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Hình ảnh sản phẩm với nền
                  Container(
                    decoration: BoxDecoration(
                      color: Color(0xFFF2F3F4),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Padding(
                      padding: EdgeInsets.all(5),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.asset(
                          product.imageUrl,
                          width: double.infinity,
                          height: 150,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 5),

                  // Hàng chứa giá tiền và icon trái tim
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Giá tiền căn trái
                        Text(
                          formatCurrency(product.discountedPrice
                              .toInt()), // ✅ Gọi hàm tính toán giá giảm
                          style: TextStyle(
                            fontSize: 15,
                            color: Color(0xFF00B98E),
                          ),
                        ),
                        // Icon trái tim căn phải
                        Icon(
                          Icons.favorite_border,
                          color: Colors.grey[400],
                          size: 20,
                        ),
                      ],
                    ),
                  ),

                  // Giá tiền gốc + giảm giá
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: Row(
                      // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Giá tiền căn trái
                        Text(
                          formatCurrency(
                              product.price as int), // định dạng tiền
                          style: TextStyle(
                            fontSize: 12,
                            // fontWeight: FontWeight.bold,
                            color: Colors.grey,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),

                        SizedBox(
                          width: 5,
                        ),

                        // Phần trăm giảm giá
                        Text(
                          '-${product.discountPercentage}%',
                          style: TextStyle(
                            color: Color(0xFFEC7063),
                            fontSize: 12,
                            // fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          );
        },
      ),
    );
  }
}
