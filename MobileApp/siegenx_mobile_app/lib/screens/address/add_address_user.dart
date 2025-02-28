import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';

class AddAddressUserScreen extends StatefulWidget {
  const AddAddressUserScreen({Key? key}) : super(key: key);

  @override
  _AddAddressUserScreenState createState() => _AddAddressUserScreenState();
}

class _AddAddressUserScreenState extends State<AddAddressUserScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _fullnameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _streetController = TextEditingController();
  final TextEditingController _precinctController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _provinceController = TextEditingController();
  bool isLoading = false;
  bool isDefault = false; // Trạng thái công tắc "Đặt làm mặc định"

  Future<void> _addAddress() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;

    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng đăng nhập để thêm địa chỉ')),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse('${ApiService.profile}/address/add'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'fullname': _fullnameController.text,
          'phone': _phoneController.text,
          'street': _streetController.text,
          'precinct': _precinctController.text,
          'city': _cityController.text,
          'province': _provinceController.text,
          'isDefault': isDefault, // Gửi trạng thái mặc định lên server
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Thêm địa chỉ thành công')),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi thêm địa chỉ')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: $e')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _fullnameController.dispose();
    _phoneController.dispose();
    _streetController.dispose();
    _precinctController.dispose();
    _cityController.dispose();
    _provinceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF2F3F4), // Màu nền toàn bộ F2F3F4
      appBar: AppBar(
        title: Text(
          'Thêm địa chỉ mới',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        centerTitle: true,
        elevation: 0, // Bỏ bóng để hòa với nền
        backgroundColor: Colors.transparent, // Bỏ màu xanh
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Thông tin liên hệ
                Text(
                  'Thông tin liên hệ',
                  style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.w500, // Bold nhẹ
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(
                      top: BorderSide(color: Colors.grey.withOpacity(0.3)),
                      bottom: BorderSide(color: Colors.grey.withOpacity(0.3)),
                    ),
                  ),
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _fullnameController,
                        decoration:
                            InputDecoration(labelText: 'Tên người nhận'),
                        validator: (value) => value!.isEmpty
                            ? 'Vui lòng nhập tên người nhận'
                            : null,
                      ),
                      SizedBox(height: 16),
                      TextFormField(
                        controller: _phoneController,
                        decoration: InputDecoration(labelText: 'Số điện thoại'),
                        keyboardType: TextInputType.phone,
                        validator: (value) => value!.isEmpty
                            ? 'Vui lòng nhập số điện thoại'
                            : null,
                      ),
                    ],
                  ),
                ),

                // Khoảng cách và Thông tin địa chỉ
                SizedBox(height: 10),
                Text(
                  'Thông tin địa chỉ',
                  style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(
                      top: BorderSide(color: Colors.grey.withOpacity(0.3)),
                      bottom: BorderSide(color: Colors.grey.withOpacity(0.3)),
                    ),
                  ),
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _streetController,
                        decoration: InputDecoration(labelText: 'Đường'),
                        validator: (value) => value!.isEmpty
                            ? 'Vui lòng nhập địa chỉ đường'
                            : null,
                      ),
                      SizedBox(height: 16),
                      TextFormField(
                        controller: _precinctController,
                        decoration: InputDecoration(labelText: 'Phường/Xã'),
                        validator: (value) =>
                            value!.isEmpty ? 'Vui lòng nhập phường/xã' : null,
                      ),
                      SizedBox(height: 16),
                      TextFormField(
                        controller: _cityController,
                        decoration: InputDecoration(labelText: 'Thành phố'),
                        validator: (value) =>
                            value!.isEmpty ? 'Vui lòng nhập thành phố' : null,
                      ),
                      SizedBox(height: 16),
                      TextFormField(
                        controller: _provinceController,
                        decoration: InputDecoration(labelText: 'Tỉnh'),
                        validator: (value) =>
                            value!.isEmpty ? 'Vui lòng nhập tỉnh' : null,
                      ),
                    ],
                  ),
                ),

                // Khoảng cách và Cài đặt
                SizedBox(height: 10),
                Text(
                  'Cài đặt',
                  style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(
                      top: BorderSide(color: Colors.grey.withOpacity(0.3)),
                      bottom: BorderSide(color: Colors.grey.withOpacity(0.3)),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Đặt làm mặc định',
                        style: TextStyle(fontSize: 14),
                      ),
                      Switch(
                        value: isDefault,
                        onChanged: (value) {
                          setState(() {
                            isDefault = value;
                          });
                        },
                        activeColor: Colors.green, // Màu khi bật (giống iPhone)
                      ),
                    ],
                  ),
                ),

                // Khoảng cách và Nút Lưu
                SizedBox(height: 24),
                isLoading
                    ? Center(child: CircularProgressIndicator())
                    : SizedBox(
                        width: double.infinity, // Phủ gần hết chiều ngang
                        child: ElevatedButton(
                          onPressed: _addAddress,
                          style: ElevatedButton.styleFrom(
                            backgroundColor:
                                AppColors.primaryColor, // Giữ màu xanh
                            padding: EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: Text(
                            'Lưu',
                            style: TextStyle(fontSize: 18, color: Colors.white),
                          ),
                        ),
                      ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
