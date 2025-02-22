import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/test/sample_products.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/utils/dialog_utils.dart';

class CartProductGrid extends StatefulWidget {
  const CartProductGrid({Key? key}) : super(key: key);

  @override
  _CartProductGridState createState() => _CartProductGridState();
}

class _CartProductGridState extends State<CartProductGrid> {
  final Map<int, bool> _selectedProducts = {};

  @override
  Widget build(BuildContext context) {
    final cartProducts =
        sampleProducts.where((product) => product.quantity > 0).toList();

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 0.0),
      child: ListView.builder(
        shrinkWrap: true,
        physics: NeverScrollableScrollPhysics(),
        itemCount: cartProducts.length,
        itemBuilder: (context, index) {
          final product = cartProducts[index];
          _selectedProducts.putIfAbsent(index, () => false);

          return Column(
            children: [
              GestureDetector(
                onLongPress: () {
                  showProductDialog(context, product);
                },
                child: Container(
                  margin: EdgeInsets.only(bottom: 12),
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Checkbox tròn nhỏ hơn
                      SizedBox(
                        width: 24,
                        height: 24,
                        child: Checkbox(
                          shape: CircleBorder(),
                          value: _selectedProducts[index],
                          activeColor: Colors.green, // Đổi màu khi true
                          onChanged: (bool? value) {
                            setState(() {
                              _selectedProducts[index] = value ?? false;
                            });
                          },
                        ),
                      ),
                      SizedBox(width: 8),

                      // Hình ảnh sản phẩm
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.asset(
                          product.imageUrl,
                          width: 90,
                          height: 90,
                          fit: BoxFit.cover,
                        ),
                      ),
                      SizedBox(width: 8),

                      // Nội dung sản phẩm
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              product.name,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.black,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            SizedBox(height: 2),
                            Text(
                              formatCurrency(product.discountedPrice.toInt()),
                              style: TextStyle(
                                fontSize: 15,
                                color: Color(0xFF00B98E),
                              ),
                            ), // Đã thêm dấu đóng ngoặc
                            SizedBox(height: 0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                if (product.discountPercentage > 0)
                                  Row(
                                    children: [
                                      Text(
                                        formatCurrency(product.price as int),
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                          decoration:
                                              TextDecoration.lineThrough,
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
                                Container(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[200],
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      GestureDetector(
                                        onTap: () {
                                          // TODO: Giảm số lượng
                                        },
                                        child: Padding(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 8),
                                          child: Text('-',
                                              style: TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.bold)),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 10),
                                        child: Text(
                                          product.quantity.toString(),
                                          style: TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w500),
                                        ),
                                      ),
                                      GestureDetector(
                                        onTap: () {
                                          // TODO: Tăng số lượng
                                        },
                                        child: Padding(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 8),
                                          child: Text('+',
                                              style: TextStyle(
                                                  fontSize: 15,
                                                  fontWeight: FontWeight.bold)),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Thêm đường kẻ ngăn cách
              if (index < cartProducts.length - 1)
                Divider(
                  color:
                      Colors.grey.withOpacity(0.3), // Sửa thành named argument
                  height: 1, // Sửa thành named argument
                  thickness: 1, // Sửa thành named argument
                ),
            ],
          );
        },
      ),
    );
  }
}
