import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/models/order.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:intl/intl.dart'; // Import thêm package intl

class OrderItemWidget extends StatelessWidget {
  final OrderItem item;

  const OrderItemWidget({super.key, required this.item});

  String formatCurrency(double amount) {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: 'đ');
    return formatter.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Cột 1: Hình ảnh
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: Color(0xFFF2F3F4), // Nền màu F2F3F4
            borderRadius: BorderRadius.circular(5), // Bo tròn góc 5
            image: DecorationImage(
              image: NetworkImage(
                item.images.isNotEmpty
                    ? '${ApiService.imageBaseUrl}${item.images[0]}'
                    : 'https://via.placeholder.com/80',
              ),
              fit: BoxFit.cover,
            ),
          ),
        ),
        const SizedBox(width: 12),
        // Cột 2: Text
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hàng 1: Tên sản phẩm
              Text(
                item.title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 15),
              // Hàng 2: Giá tiền và số lượng
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Text(
                    formatCurrency(item.price), // Sử dụng hàm formatCurrency
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.primaryColor,
                    ),
                  ),
                  const SizedBox(width: 20),
                  Text(
                    'x${item.quantity}',
                    style: const TextStyle(
                      fontSize: 14,
                      // color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}
