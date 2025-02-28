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
  bool isDefault = false;

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
          'isDefault': isDefault,
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
      backgroundColor: Color(0xFFF2F3F4),
      appBar: AppBar(
        title: Text(
          'Thêm địa chỉ mới',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Thông tin liên hệ
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Text(
                  'Thông tin liên hệ',
                  style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
              ),
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
                      decoration: InputDecoration(
                        hintText: 'Tên người nhận',
                        hintStyle: TextStyle(color: Colors.grey[400]),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                      ),
                      validator: (value) => value!.isEmpty
                          ? 'Vui lòng nhập tên người nhận'
                          : null,
                    ),
                    SizedBox(height: 16),
                    TextFormField(
                      controller: _phoneController,
                      decoration: InputDecoration(
                        hintText: 'Số điện thoại',
                        hintStyle: TextStyle(color: Colors.grey[400]),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                      ),
                      keyboardType: TextInputType.phone,
                      validator: (value) =>
                          value!.isEmpty ? 'Vui lòng nhập số điện thoại' : null,
                    ),
                  ],
                ),
              ),

              const SizedBox(
                height: 20,
              ),

              // Thông tin địa chỉ
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Text(
                  'Thông tin địa chỉ',
                  style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
              ),
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
                      decoration: InputDecoration(
                        hintText: 'Đường',
                        hintStyle: TextStyle(color: Colors.grey[400]),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                      ),
                      validator: (value) =>
                          value!.isEmpty ? 'Vui lòng nhập địa chỉ đường' : null,
                    ),
                    SizedBox(height: 16),
                    TextFormField(
                      controller: _precinctController,
                      decoration: InputDecoration(
                        hintText: 'Phường/Xã',
                        hintStyle: TextStyle(color: Colors.grey[400]),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                      ),
                      validator: (value) =>
                          value!.isEmpty ? 'Vui lòng nhập phường/xã' : null,
                    ),
                    SizedBox(height: 16),
                    TextFormField(
                      controller: _cityController,
                      decoration: InputDecoration(
                        hintText: 'Thành phố',
                        hintStyle: TextStyle(color: Colors.grey[400]),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                      ),
                      validator: (value) =>
                          value!.isEmpty ? 'Vui lòng nhập thành phố' : null,
                    ),
                    SizedBox(height: 16),
                    TextFormField(
                      controller: _provinceController,
                      decoration: InputDecoration(
                        hintText: 'Tỉnh',
                        hintStyle: TextStyle(color: Colors.grey[400]),
                        enabledBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                        focusedBorder: UnderlineInputBorder(
                          borderSide: BorderSide(
                            color: Colors.grey[400]!,
                            width: 0.5,
                          ),
                        ),
                      ),
                      validator: (value) =>
                          value!.isEmpty ? 'Vui lòng nhập tỉnh' : null,
                    ),
                  ],
                ),
              ),

              const SizedBox(
                height: 20,
              ),

              // Cài đặt
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Text(
                  'Cài đặt',
                  style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
              ),
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
                      activeColor: Colors.green,
                    ),
                  ],
                ),
              ),

              // Nút Lưu
              SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: isLoading
                    ? Center(child: CircularProgressIndicator())
                    : SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _addAddress,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryColor,
                            padding: EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius:
                                  BorderRadius.circular(5), // Bo góc 5
                            ),
                          ),
                          child: Text(
                            'Lưu',
                            style: TextStyle(fontSize: 20, color: Colors.white),
                          ),
                        ),
                      ),
              ),
              SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
