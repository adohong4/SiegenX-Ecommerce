import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
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
                child: Image.network(
                  '${ApiService.imageBaseUrl}${product.imageUrl[0]}',
                  width: 200, // Điều chỉnh kích thước về giá trị hợp lý
                  height: 200,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Icon(
                    Icons.error,
                    color: Colors.red,
                    size: 120,
                  ),
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

              // Giá tiền và số lượng
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    formatCurrency(product.price),
                    style: TextStyle(fontSize: 16, color: Color(0xFF00B98E)),
                  ),
                ],
              ),
              SizedBox(height: 5),
              Text(
                'Số lượng: ${product.quantity}',
                style: TextStyle(fontSize: 14, color: Colors.black54),
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
