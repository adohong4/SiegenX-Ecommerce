import 'package:flutter/material.dart';

class CustomSnackBar {
  static void show(
      BuildContext context, String message, IconData icon, Color iconColor) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Container(
          height: 40, // Định chiều cao cho căn giữa tốt hơn
          alignment: Alignment.center, // Căn giữa nội dung theo chiều dọc
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center, // Căn giữa ngang
            children: [
              Icon(icon, color: iconColor), // Icon động theo tham số
              SizedBox(width: 10), // Khoảng cách giữa icon và chữ
              Expanded(
                child: Text(
                  message,
                  // textAlign: TextAlign.center, // Căn giữa chữ
                  style: TextStyle(color: Colors.black), // Màu chữ xanh
                ),
              ),
            ],
          ),
        ),
        backgroundColor: Colors.white, // Nền trắng
        behavior: SnackBarBehavior.floating, // Hiển thị nổi
        margin: EdgeInsets.all(16), // Khoảng cách so với mép màn hình
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8), // Bo góc
        ),
      ),
    );
  }
}
