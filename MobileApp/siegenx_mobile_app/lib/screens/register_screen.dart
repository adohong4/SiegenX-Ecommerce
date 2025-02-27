import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/screens/login_screen.dart';
import 'package:siegenx_mobile_app/screens/manager_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 400),
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  "Đăng ký tài khoản",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                _gap(),
                _buildTextField(label: 'Họ và tên', icon: Icons.person),
                _gap(),
                _buildTextField(
                    label: 'Tên người dùng', icon: Icons.account_circle),
                _gap(),
                _buildTextField(
                    label: 'Email', icon: Icons.email, isEmail: true),
                _gap(),
                _buildTextField(label: 'Số điện thoại', icon: Icons.phone),
                _gap(),
                _buildTextField(
                    label: 'Tên đăng nhập', icon: Icons.person_outline),
                _gap(),
                _buildPasswordField(
                    label: 'Mật khẩu',
                    isPasswordVisible: _isPasswordVisible,
                    onToggle: () {
                      setState(() => _isPasswordVisible = !_isPasswordVisible);
                    }),
                _gap(),
                _buildPasswordField(
                    label: 'Nhập lại mật khẩu',
                    isPasswordVisible: _isConfirmPasswordVisible,
                    onToggle: () {
                      setState(() => _isConfirmPasswordVisible =
                          !_isConfirmPasswordVisible);
                    }),
                _gap(),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff00B98E),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                    ),
                    child: const Padding(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      child: Text(
                        'ĐĂNG KÝ',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    onPressed: () {
                      // if (_formKey.currentState?.validate() ?? false) {
                      //   // Xử lý đăng ký
                      // }

                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ManagerScreen(),
                        ),
                      );
                    },
                  ),
                ),
                _gap(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Đã có tài khoản?',
                      style: TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                    TextButton(
                      onPressed: () {
                        // Chuyển sang màn hình đăng nhập
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => LoginScreen()),
                        );
                      },
                      child: const Text(
                        'ĐĂNG NHẬP',
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
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required IconData icon,
    bool isEmail = false,
  }) {
    return TextFormField(
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Vui lòng nhập $label';
        }
        if (isEmail &&
            !RegExp(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
                .hasMatch(value)) {
          return 'Email không hợp lệ';
        }
        return null;
      },
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: const Color(0xff00B98E)),
        filled: true,
        fillColor: const Color(0xffF2F3F4),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildPasswordField({
    required String label,
    required bool isPasswordVisible,
    required VoidCallback onToggle,
  }) {
    return TextFormField(
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Vui lòng nhập $label';
        }
        if (value.length < 6) {
          return 'Mật khẩu ít nhất 6 ký tự';
        }
        return null;
      },
      obscureText: !isPasswordVisible,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: const Icon(Icons.lock, color: Color(0xff00B98E)),
        filled: true,
        fillColor: const Color(0xffF2F3F4),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
        suffixIcon: IconButton(
          icon:
              Icon(isPasswordVisible ? Icons.visibility_off : Icons.visibility),
          onPressed: onToggle,
        ),
      ),
    );
  }

  Widget _gap() => const SizedBox(height: 16);
}
