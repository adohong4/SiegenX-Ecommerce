import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/screens/profile/logout_confirmation_dialog.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/screens/login_screen.dart';

class LogoutController {
  Future<void> logout(BuildContext context) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;

    // Hiển thị thông báo xác nhận đăng xuất từ widget riêng
    bool? confirmLogout = await showDialog<bool>(
      context: context,
      builder: (context) => const LogoutConfirmationDialog(),
    );

    // Nếu người dùng không xác nhận, thoát hàm
    if (confirmLogout != true) return;

    // Tiếp tục xử lý đăng xuất
    try {
      if (token == null) {
        // Nếu không có token, chỉ xóa dữ liệu và chuyển hướng
        authProvider.clearAuthData();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => LoginScreen()),
        );
        return;
      }

      final response = await http.post(
        Uri.parse(ApiService.logout),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'jwt=$token', // Gửi token qua header Cookie đúng định dạng
        },
      );

      print('Logout status: ${response.statusCode}');
      print('Logout body: ${response.body}');

      if (response.statusCode == 200) {
        // Đăng xuất thành công, xóa dữ liệu và chuyển hướng
        authProvider.clearAuthData();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => LoginScreen()),
        );
      } else {
        // Đăng xuất thất bại, hiển thị thông báo lỗi
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Text('Lỗi đăng xuất'),
            content: Text('Không thể đăng xuất: ${response.statusCode}'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('OK'),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      // Lỗi kết nối, hiển thị thông báo lỗi
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Lỗi kết nối'),
          content: Text('Không thể đăng xuất: $e'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('OK'),
            ),
          ],
        ),
      );
    }
  }
}
