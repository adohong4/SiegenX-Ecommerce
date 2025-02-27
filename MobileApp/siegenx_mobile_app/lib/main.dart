import 'package:device_preview/device_preview.dart';
import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/screens/manager_screen.dart';
import 'package:siegenx_mobile_app/screens/register_screen.dart';
import 'screens/login_screen.dart'; // Thêm import này

void main() {
  runApp(DevicePreview(builder: (context) => const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const LoginScreen(), // Đổi thành màn hình đăng nhập
    );
  }
}
