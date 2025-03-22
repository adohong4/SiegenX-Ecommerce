import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';

class DeleteConfirmationDialog {
  static Future<bool?> showConfirmDeleteDialog(
    BuildContext context, {
    required String productName,
    required int quantity,
  }) async {
    return await showDialog<bool>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10), // Bo góc 10 cho dialog
          ),
          title: const Center(
            // Căn giữa tiêu đề
            child: Text(
              'Xác nhận xóa',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min, // Giới hạn kích thước cột
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image.asset(
              //   'assets/icons/delete.png', // Đường dẫn tới hình ảnh PNG của bạn
              //   width: 80, // Kích thước hình ảnh (tùy chỉnh theo ý bạn)
              //   height: 80,
              // ),
              // const SizedBox(height: 10), // Khoảng cách giữa hình và nội dung
              Text(
                'Bạn có chắc muốn xóa?',
                // textAlign: TextAlign.start, // Căn giữa nội dung
              ),
              Text(
                '- $productName',
                // textAlign: TextAlign.start, // Căn giữa nội dung
              ),
              Text(
                '- số lượng: $quantity',
                // textAlign: TextAlign.start, // Căn giữa nội dung
              ),
            ],
          ),
          actionsAlignment: MainAxisAlignment.spaceEvenly, // Chia đều hai nút
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text(
                'Hủy',
                style: TextStyle(
                  color: Color(0xff929292), // Màu chữ mặc định
                  fontSize: 16,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pop(true),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.textColorRed, // Màu nền đỏ
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(5), // Bo góc 5
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 40, // Tăng độ dài của nút
                  vertical: 12, // Tăng chiều cao của nút
                ),
              ),
              child: const Text(
                'Xóa',
                style: TextStyle(
                  color: Colors.white, // Chữ trắng
                  fontSize: 16,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
