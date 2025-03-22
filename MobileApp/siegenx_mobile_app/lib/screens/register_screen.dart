import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/register_controller.dart';
import 'package:siegenx_mobile_app/screens/enter_information_screen.dart';
import 'package:siegenx_mobile_app/screens/login_screen.dart';

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      body: Center(
        child: isSmallScreen
            ? Column(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  _Header(),
                  _FormContent(),
                ],
              )
            : Container(
                padding: const EdgeInsets.all(32.0),
                constraints: const BoxConstraints(maxWidth: 800),
                child: Row(
                  children: const [
                    Expanded(child: _Header()),
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

class _Header extends StatelessWidget {
  const _Header({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 0.0, top: 16.0),
          child: Text(
            "Tạo tài khoản",
            textAlign: TextAlign.left,
            style: isSmallScreen
                ? Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                      fontSize: 28,
                    )
                : Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                      fontSize: 28,
                    ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(left: 0.0, top: 8.0, bottom: 16.0),
          child: Text(
            "Vui lòng nhập đầy đủ thông tin và tạo tài khoản.",
            textAlign: TextAlign.left,
            style: isSmallScreen
                ? Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Color(0xff929292),
                    )
                : Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Color(0xff929292),
                    ),
          ),
        ),
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
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final RegisterController _registerController = RegisterController();
  bool _isLoading = false;

  // Trong __FormContentState của RegisterScreen
  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final result = await _registerController.registerUser(
      username: _usernameController.text,
      email: _emailController.text,
      password: _passwordController.text,
    );

    setState(() {
      _isLoading = false;
    });

    if (result['success']) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'])),
      );
      // Truyền token và userId sang màn hình tiếp theo
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => EnterInformationScreen(
            token: result['data']['metadata']['token'],
            userId: result['data']['metadata']['user']['_id'],
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'])),
      );
    }
  }

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
            SizedBox(height: 10),
            TextFormField(
              controller: _usernameController,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập tên người dùng';
                }
                return null;
              },
              decoration: const InputDecoration(
                labelText: 'Tên người dùng',
                labelStyle: TextStyle(color: Color(0xff00B98E)),
                prefixIcon: Padding(
                  padding: EdgeInsets.all(12.0),
                  child: Image(
                    image: AssetImage('assets/icons/user.png'),
                    width: 24,
                    height: 24,
                  ),
                ),
                filled: true,
                fillColor: Color(0xffF2F3F4),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 16.0),
              ),
            ),
            _gap(),
            TextFormField(
              controller: _emailController,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập email';
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
                labelText: 'Email',
                labelStyle: TextStyle(color: Color(0xff00B98E)),
                prefixIcon: Padding(
                  padding: EdgeInsets.all(12.0),
                  child: Image(
                    image: AssetImage('assets/icons/email.png'),
                    width: 24,
                    height: 24,
                  ),
                ),
                filled: true,
                fillColor: Color(0xffF2F3F4),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 16.0),
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
                if (value.length < 8) {
                  // Thay đổi thành 8 để khớp với backend
                  return 'Mật khẩu ít nhất 8 ký tự';
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
                  padding: EdgeInsets.all(12.0),
                  child: Image(
                    image: AssetImage('assets/icons/lock.png'),
                    width: 24,
                    height: 24,
                  ),
                ),
                contentPadding: EdgeInsets.symmetric(vertical: 16.0),
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
            TextFormField(
              controller: _confirmPasswordController,
              obscureText: !_isConfirmPasswordVisible,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập lại mật khẩu';
                }
                if (value != _passwordController.text) {
                  return 'Mật khẩu không khớp';
                }
                return null;
              },
              decoration: InputDecoration(
                labelText: 'Xác nhận mật khẩu',
                labelStyle: TextStyle(color: Color(0xff00B98E)),
                filled: true,
                fillColor: Color(0xffF2F3F4),
                border: InputBorder.none,
                prefixIcon: Padding(
                  padding: EdgeInsets.all(12.0),
                  child: Image(
                    image: AssetImage('assets/icons/lock.png'),
                    width: 24,
                    height: 24,
                  ),
                ),
                contentPadding: EdgeInsets.symmetric(vertical: 16.0),
                suffixIcon: IconButton(
                  icon: Icon(_isConfirmPasswordVisible
                      ? Icons.visibility_off
                      : Icons.visibility),
                  onPressed: () {
                    setState(() {
                      _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                    });
                  },
                ),
              ),
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
                onPressed: _isLoading ? null : _handleRegister,
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: _isLoading
                      ? CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'TIẾP TỤC',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ),
            const SizedBox(height: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Đã có tài khoản?',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => LoginScreen()),
                    );
                  },
                  child: const Text(
                    'ĐĂNG NHẬP NGAY',
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
