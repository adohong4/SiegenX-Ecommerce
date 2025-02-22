import 'package:flutter/material.dart';
import '../test/sample_products.dart';
import '../utils/format_untils.dart';

void showProductDialog(BuildContext context, dynamic product) {
  showDialog(
    context: context,
    builder: (context) {
      return Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Hình ảnh sản phẩm lớn hơn
              ClipRRect(
                borderRadius: BorderRadius.circular(15),
                child: Image.asset(
                  product.imageUrl,
                  width: 200,
                  height: 200,
                  fit: BoxFit.cover,
                ),
              ),
              SizedBox(height: 10),

              // Tên sản phẩm
              Text(
                product.name,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 5),

              // Giá tiền và giảm giá
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    formatCurrency(product.discountedPrice.toInt()),
                    style: TextStyle(fontSize: 16, color: Color(0xFF00B98E)),
                  ),
                  SizedBox(width: 10),
                  Text(
                    formatCurrency(product.price as int),
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                      decoration: TextDecoration.lineThrough,
                    ),
                  ),
                  SizedBox(width: 5),
                  Text(
                    '-${product.discountPercentage}%',
                    style: TextStyle(fontSize: 14, color: Color(0xFFEC7063)),
                  ),
                ],
              ),
              SizedBox(height: 10),

              // Nút đóng
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: Text("Đóng"),
              ),
            ],
          ),
        ),
      );
    },
  );
}
