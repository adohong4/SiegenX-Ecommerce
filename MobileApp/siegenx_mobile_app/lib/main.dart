import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/screens/home_screen.dart';
import 'screens/login_screen.dart'; // Thêm import này

void main() {
  runApp(const MyApp());
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
      home: const HomeScreen(), // Đổi thành màn hình đăng nhập
    );
  }
}

// Có thể xóa phần MyHomePage đi vì không dùng đến nữa
