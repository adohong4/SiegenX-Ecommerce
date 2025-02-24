import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/test/sample_products.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/utils/dialog_utils.dart';

class FavoriteProductGrid extends StatelessWidget {
  const FavoriteProductGrid({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final favoriteProducts =
        sampleProducts.where((product) => product.isFavorite).toList();

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.0),
      child: ListView.builder(
        shrinkWrap: true,
        physics: NeverScrollableScrollPhysics(),
        itemCount: favoriteProducts.length,
        itemBuilder: (context, index) {
          final product = favoriteProducts[index];

          return GestureDetector(
            onLongPress: () {
              showProductDialog(context, product);
            },
            child: Container(
              margin: EdgeInsets.only(bottom: 12),
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 5,
                    spreadRadius: 1,
                  )
                ],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Hình ảnh bên trái
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.asset(
                      product.imageUrl,
                      width: 90,
                      height: 90,
                      fit: BoxFit.cover,
                    ),
                  ),
                  SizedBox(width: 5),

                  // Nội dung bên phải
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Hàng 1: Tên sản phẩm + Icon trái tim
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                product.name,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(
                              width: 3,
                            ),
                            Icon(
                              Icons.favorite,
                              color: Color(0xFFEC7063),
                              size: 20,
                            ),
                          ],
                        ),
                        SizedBox(height: 4),

                        // Hàng 2: Giá tiền sau khi giảm
                        Text(
                          formatCurrency(product.discountedPrice.toInt()),
                          style: TextStyle(
                            fontSize: 15,
                            color: Color(0xFF00B98E),
                            // fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 4),

                        // Hàng 3: Giá gốc + % giảm giá (trái) | Icon giỏ hàng + Button Mua ngay (phải)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Bên trái: Giá gốc và phần trăm giảm giá (nếu có)
                            if (product.discountPercentage > 0)
                              Row(
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
                                      // fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),

                            // Bên phải: Icon giỏ hàng + Button "Mua ngay"
                            Row(
                              children: [
                                IconButton(
                                  icon: Icon(Icons.add_shopping_cart_rounded,
                                      color: Colors.black, size: 20),
                                  onPressed: () {
                                    // TODO: Thêm chức năng giỏ hàng
                                  },
                                ),
                                SizedBox(width: 5),
                                ElevatedButton(
                                  onPressed: () {
                                    // TODO: Thêm chức năng mua ngay
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Color(0xFFEC7063),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(5),
                                    ),
                                    padding: EdgeInsets.symmetric(
                                        horizontal: 10, vertical: 5),
                                  ),
                                  child: Text(
                                    'Mua ngay',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.white,
                                      // fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
