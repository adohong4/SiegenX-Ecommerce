import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/add_cart.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';

class AddToCartBottomSheet extends StatelessWidget {
  final Product product;

  const AddToCartBottomSheet({Key? key, required this.product})
      : super(key: key);

  int calculateDiscountPercentage(double price, double newPrice) {
    return (((price - newPrice) / price) * 100).round();
  }

  @override
  Widget build(BuildContext context) {
    int quantity = 1; // Số lượng mặc định

    return StatefulBuilder(
      builder: (BuildContext context, StateSetter setState) {
        return Container(
          padding: EdgeInsets.all(16),
          height: 300, // Chiều cao cố định cho Bottom Sheet
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hàng 1: Hình ảnh + Giá tiền
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      '${ApiService.imageBaseUrl}${product.images.isNotEmpty ? product.images[0] : ''}',
                      width: 50,
                      height: 50,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          Icon(Icons.image, size: 50, color: Colors.grey),
                    ),
                  ),
                  SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.newPrice != null
                            ? formatCurrency(product.newPrice!)
                            : formatCurrency(product.price),
                        style: TextStyle(
                          fontSize: 18,
                          color: Color(0xFF00B98E),
                        ),
                      ),
                      Row(
                        children: [
                          if (product.newPrice != null)
                            Text(
                              formatCurrency(product.price),
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                                decoration: TextDecoration.lineThrough,
                              ),
                            ),
                          SizedBox(width: 8),
                          if (product.newPrice != null)
                            Text(
                              '-${calculateDiscountPercentage(product.price, product.newPrice!)}%',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.textColorRed,
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              SizedBox(height: 16),

              // Hàng 2: Hình ảnh sản phẩm
              Center(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    '${ApiService.imageBaseUrl}${product.images.isNotEmpty ? product.images[0] : ''}',
                    width: 100,
                    height: 100,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        Icon(Icons.image, size: 100, color: Colors.grey),
                  ),
                ),
              ),
              SizedBox(height: 16),

              // Hàng 3: Số lượng + Điều chỉnh số lượng
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Số lượng',
                    style: TextStyle(fontSize: 16),
                  ),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(5),
                    ),
                    child: Row(
                      children: [
                        GestureDetector(
                          onTap: () {
                            if (quantity > 1) {
                              setState(() {
                                quantity--;
                              });
                            }
                          },
                          child: Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8),
                            child: Text(
                              '-',
                              style: TextStyle(fontSize: 18),
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            '$quantity',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              quantity++;
                            });
                          },
                          child: Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8),
                            child: Text(
                              '+',
                              style: TextStyle(fontSize: 18),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),

              // Hàng 4: Button thêm vào giỏ hàng
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    try {
                      // Gọi API thêm vào giỏ hàng với số lượng
                      for (int i = 0; i < quantity; i++) {
                        await AddCartController.addToCart(context, product.id);
                      }
                      Navigator.pop(context); // Đóng Bottom Sheet
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Đã thêm vào giỏ hàng')),
                      );
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(e.toString())),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF00B98E),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Text(
                    'Thêm vào giỏ hàng',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
