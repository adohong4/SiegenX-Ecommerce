import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/auth_controller.dart';
import 'package:siegenx_mobile_app/screens/manager_screen.dart';
import 'package:siegenx_mobile_app/screens/register_screen.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      body: Center(
        child: isSmallScreen
            ? Column(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  _Logo(),
                  _FormContent(),
                ],
              )
            : Container(
                padding: const EdgeInsets.all(32.0),
                constraints: const BoxConstraints(maxWidth: 800),
                child: Row(
                  children: const [
                    Expanded(child: _Logo()),
                    Expanded(
                      child: Center(child: _FormContent()),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}

class _Logo extends StatelessWidget {
  const _Logo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Image.asset(
          'assets/logo.png',
          height: isSmallScreen ? 150 : 250,
        ),
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Text(
            "CHẠM CÔNG NGHỆ - NỐI TƯƠNG LAI",
            textAlign: TextAlign.center,
            style: isSmallScreen
                ? Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Color(0xff929292),
                    )
                : Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Color(0xff929292),
                      fontWeight: FontWeight.bold,
                    ),
          ),
        )
      ],
    );
  }
}

class _FormContent extends StatefulWidget {
  const _FormContent({Key? key}) : super(key: key);

  @override
  State<_FormContent> createState() => __FormContentState();
}

class __FormContentState extends State<_FormContent> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isPasswordVisible = false;
  bool _rememberMe = false;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 350),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              height: 10,
            ),
            TextFormField(
              controller: _emailController,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập tài khoản';
                }
                bool emailValid = RegExp(
                        r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                    .hasMatch(value);
                if (!emailValid) {
                  return 'Email không hợp lệ';
                }
                return null;
              },
              decoration: const InputDecoration(
                labelText: 'Tài khoản',
                labelStyle: TextStyle(color: Color(0xff00B98E)),
                prefixIcon: Padding(
                  padding: EdgeInsets.all(12.0), // Căn chỉnh icon
                  child: Image(
                    image: AssetImage('assets/icons/user.png'),
                    width: 24, // Điều chỉnh kích thước icon
                    height: 24,
                  ),
                ),
                filled: true,
                fillColor: Color(0xffF2F3F4),
                border: InputBorder.none,
                contentPadding:
                    EdgeInsets.symmetric(vertical: 16.0), // Tăng chiều cao
              ),
            ),
            _gap(),
            TextFormField(
              controller: _passwordController,
              obscureText: !_isPasswordVisible,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập mật khẩu';
                }
                if (value.length < 6) {
                  return 'Mật khẩu ít nhất 6 ký tự';
                }
                return null;
              },
              decoration: InputDecoration(
                labelText: 'Mật khẩu',
                labelStyle: TextStyle(color: Color(0xff00B98E)),
                filled: true,
                fillColor: Color(0xffF2F3F4),
                border: InputBorder.none,
                prefixIcon: Padding(
                  padding: EdgeInsets.all(12.0), // Căn chỉnh icon
                  child: Image(
                    image: AssetImage('assets/icons/lock.png'),
                    width: 24, // Điều chỉnh kích thước icon
                    height: 24,
                  ),
                ),
                contentPadding:
                    EdgeInsets.symmetric(vertical: 16.0), // Tăng chiều cao
                suffixIcon: IconButton(
                  icon: Icon(_isPasswordVisible
                      ? Icons.visibility_off
                      : Icons.visibility),
                  onPressed: () {
                    setState(() {
                      _isPasswordVisible = !_isPasswordVisible;
                    });
                  },
                ),
              ),
            ),
            _gap(),
            CheckboxListTile(
              value: _rememberMe,
              onChanged: (value) {
                setState(() {
                  _rememberMe = value ?? false;
                });
              },
              title: const Text('Ghi nhớ đăng nhập'),
              controlAffinity: ListTileControlAffinity.leading,
              dense: true,
              contentPadding: EdgeInsets.zero,
            ),
            _gap(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xff00B98E),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                child: const Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Text(
                    'ĐĂNG NHẬP',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                onPressed: () {
                  // if (_formKey.currentState?.validate() ?? false) {
                  //   // Xử lý đăng nhập
                  // }
                  // Navigator.push(
                  //   context,
                  //   MaterialPageRoute(
                  //     builder: (context) => ManagerScreen(),
                  //   ),
                  // );

                  if (_formKey.currentState!.validate()) {
                    AuthController.login(context, _emailController.text,
                        _passwordController.text);
                  }
                },
              ),
            ),
            const SizedBox(
              height: 20,
            ),
            Row(
              children: [
                Expanded(
                    child: Divider(
                  color: Colors.grey.shade400,
                  thickness: 1,
                  endIndent: 8,
                )),

                // Dòng chữ "Đăng nhập với"
                const Text(
                  "Đăng nhập với",
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 14,
                    fontWeight: FontWeight.w500, // độ đậm trung bình
                  ),
                ),

                // Đường kẻ bên phải
                Expanded(
                    child: Divider(
                  color: Colors.grey.shade400,
                  thickness: 1,
                  indent: 8,
                ))
              ],
            ),

            const SizedBox(
              height: 20,
            ),

            // 3 logo facebook, google, apple
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                GestureDetector(
                  onTap: () {
                    // xử lý đăng nhập google
                  },
                  child: Image.asset('assets/icons/facebook.png',
                      width: 40, height: 40),
                ),
                const SizedBox(
                  width: 30,
                ),
                GestureDetector(
                  onTap: () {
                    // xử lý đăng nhập google
                  },
                  child: Image.asset('assets/icons/google.png',
                      width: 40, height: 40),
                ),
                const SizedBox(
                  width: 30,
                ),
                GestureDetector(
                  onTap: () {
                    // xử lý đăng nhập google
                  },
                  child: Image.asset('assets/icons/apple.png',
                      width: 40, height: 40),
                ),
              ],
            ),

            const SizedBox(
              height: 30,
            ),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Tôi chưa có tài khoản?',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
                TextButton(
                  onPressed: () {
                    // Xử lý khi nhấn vào nút "ĐĂNG KÝ NGAY"
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => RegisterScreen()),
                    );
                  },
                  child: const Text(
                    'ĐĂNG KÝ NGAY',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Color(0xff00B98E),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _gap() => const SizedBox(height: 16);
}
