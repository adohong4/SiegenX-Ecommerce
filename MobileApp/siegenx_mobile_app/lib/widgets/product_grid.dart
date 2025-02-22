import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/test/sample_products.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/utils/dialog_utils.dart';

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
              childAspectRatio: 0.65,
            ),
            itemCount: sampleProducts.length,
            itemBuilder: (context, index) {
              final product = sampleProducts[index];

              return GestureDetector(
                onLongPress: () {
                  showProductDialog(context, product);
                },
                child: IntrinsicHeight(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Ảnh sản phẩm với Overlay chứa giảm giá và giỏ hàng
                      Stack(
                        children: [
                          // Hình ảnh sản phẩm
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
                                  height: 160,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                          ),

                          // Ô giảm giá (Chỉ hiển thị nếu có giảm giá)
                          if (product.discountPercentage > 0)
                            Positioned(
                              top: 8,
                              left: 0,
                              child: Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Color(0xFFEC7063),
                                  borderRadius: BorderRadius.only(
                                    topRight: Radius.circular(4),
                                    bottomRight: Radius.circular(4),
                                  ),
                                ),
                                child: Text(
                                  'Giảm ${product.discountPercentage}%',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ),

                          // Icon giỏ hàng nằm trong ô vuông màu xám
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(
                              width: 30,
                              height: 30,
                              decoration: BoxDecoration(
                                color: Color(0xFFF2F3F4),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: IconButton(
                                padding: EdgeInsets.zero,
                                icon: Icon(Icons.add_shopping_cart_rounded,
                                    color: Colors.black, size: 18),
                                onPressed: () {
                                  // TODO: Thêm chức năng thêm vào giỏ hàng
                                },
                              ),
                            ),
                          ),
                        ],
                      ),

                      SizedBox(height: 5),

                      // Giá tiền và biểu tượng yêu thích
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              formatCurrency(product.discountedPrice.toInt()),
                              style: TextStyle(
                                fontSize: 15,
                                color: Color(0xFF00B98E),
                              ),
                            ),
                            Icon(
                              Icons.favorite_border,
                              color: Colors.grey[400],
                              size: 20,
                            ),
                          ],
                        ),
                      ),

                      // Giá gốc + Giảm giá (Chỉ hiển thị nếu có giảm giá)
                      if (product.discountPercentage > 0)
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 8.0),
                          child: Row(
                            children: [
                              Text(
                                formatCurrency(product.price as int),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                  decoration: TextDecoration.lineThrough,
                                ),
                              ),
                              SizedBox(width: 5),
                              Text(
                                '-${product.discountPercentage}%',
                                style: TextStyle(
                                  color: Color(0xFFEC7063),
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),

                      // Tên sản phẩm
                      Flexible(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 8.0),
                          child: Text(
                            product.name,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.black,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.start,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
