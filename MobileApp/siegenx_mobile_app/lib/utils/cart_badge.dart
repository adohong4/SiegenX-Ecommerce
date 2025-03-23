import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';

Widget buildCartBadge({
  required int cartItemCount,
  required IconData icon,
  double iconSize = 30.0,
  Color iconColor = AppColors.textColor,
}) {
  return Stack(
    clipBehavior: Clip.none, // Cho phép badge vượt ra ngoài icon
    children: [
      Padding(
        padding: const EdgeInsets.only(right: 5.0), // Dịch icon sang trái
        child: Icon(
          icon,
          size: iconSize,
          color: iconColor,
        ),
      ),
      if (cartItemCount > 0) // Chỉ hiển thị badge khi có sản phẩm
        Positioned(
          right: 0, // Điều chỉnh vị trí badge
          top: -5,
          child: Container(
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              color: Colors.red,
              borderRadius: BorderRadius.circular(10),
            ),
            constraints: const BoxConstraints(
              minWidth: 16,
              minHeight: 16,
            ),
            child: Text(
              '$cartItemCount',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
    ],
  );
}
