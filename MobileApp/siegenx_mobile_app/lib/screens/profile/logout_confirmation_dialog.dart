import 'package:flutter/material.dart';

class LogoutConfirmationDialog extends StatelessWidget {
  const LogoutConfirmationDialog({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10), // Bo góc 4 cho dialog
      ),
      backgroundColor: Colors.white,
      contentPadding:
          EdgeInsets.zero, // Bỏ padding mặc định để căn chỉnh dễ hơn
      content: Column(
        mainAxisSize: MainAxisSize.min, // Chỉ chiếm không gian cần thiết
        children: [
          SizedBox(height: 16), // Khoảng cách phía trên
          // Icon đăng xuất màu đỏ, đặt trong nền tròn hồng nhạt
          Container(
            width: 60, // Đường kính của nền tròn
            height: 60,
            decoration: BoxDecoration(
              shape: BoxShape.circle, // Hình tròn
              color: Colors.pink[50], // Nền màu hồng nhạt
            ),
            child: Center(
              child: Icon(
                Icons.logout,
                color: Color(0xFFEC7063), // Đổi màu icon thành đỏ
                size: 32,
              ),
            ),
          ),
          SizedBox(height: 8),
          // Tiêu đề "Đăng xuất", căn giữa
          Text(
            'Đăng xuất',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 8),
          // Dòng chữ "Bạn có chắc chắn muốn đăng xuất không?", căn giữa
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              'Bạn chắc chắn muốn thoát chứ?',
              style: TextStyle(
                fontSize: 14,
                color: Colors.black54,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(height: 24),
          // Hai nút "Hủy" và "Xác nhận"
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Nút "Hủy": màu nền F2F3F4, chữ xám, không bóng
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context, false), // Hủy
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFFF2F3F4), // Màu nền F2F3F4
                      elevation: 0, // Bỏ bóng đen
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4), // Bo góc 4
                      ),
                      padding: EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: Text(
                      'Hủy',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 16), // Khoảng cách giữa hai nút
                // Nút "Xác nhận": màu nền đỏ, chữ trắng, không bóng
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context, true), // Xác nhận
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFFEC7063), // Màu nền đỏ
                      elevation: 0, // Bỏ bóng đen
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4), // Bo góc 4
                      ),
                      padding: EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: Text(
                      'Xác nhận',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 16), // Khoảng cách phía dưới
        ],
      ),
    );
  }
}
