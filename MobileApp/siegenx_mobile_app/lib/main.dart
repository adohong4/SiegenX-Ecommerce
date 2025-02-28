import 'package:device_preview/device_preview.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/controllers/view_profile_controller.dart';
import 'package:siegenx_mobile_app/screens/login_screen.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';

void main() {
  runApp(
    DevicePreview(
      enabled:
          true, // Bật DevicePreview (có thể tắt bằng cách đặt false khi release)
      builder: (context) => MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthProvider()),
          ChangeNotifierProvider(
              create: (_) =>
                  ViewProfileController()), // Thêm ViewProfileControlle
        ],
        child: const MyApp(),
      ),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // Tắt banner debug
      title: 'SiegenX Mobile App', // Tiêu đề ứng dụng
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.deepPurple), // Theme từ file của bạn
        useMaterial3: true, // Sử dụng Material 3
        primarySwatch: Colors.blue, // Theme bổ sung từ gợi ý của tôi
      ),
      home: const LoginScreen(), // Màn hình mặc định là LoginScreen
    );
  }
}
