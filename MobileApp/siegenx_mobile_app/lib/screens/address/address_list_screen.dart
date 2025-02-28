import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/screens/address/add_address_user.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';

class AddressListScreen extends StatefulWidget {
  const AddressListScreen({Key? key}) : super(key: key);

  @override
  _AddressListScreenState createState() => _AddressListScreenState();
}

class _AddressListScreenState extends State<AddressListScreen> {
  List<Map<String, dynamic>> addresses = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchAddresses();
  }

  Future<void> _fetchAddresses() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String? token = authProvider.token;

    if (token == null) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vui lòng đăng nhập để xem danh sách địa chỉ')),
      );
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('${ApiService.profile}/address/getList'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          addresses =
              List<Map<String, dynamic>>.from(data['metadata']['addresses']);
          isLoading = false;
        });
      } else {
        setState(() {
          isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi lấy danh sách địa chỉ')),
        );
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi kết nối: $e')),
      );
    }
  }

  // Hàm định dạng số điện thoại: hiển thị 2 số đầu, 2 số cuối, giữa là *
  String _formatPhoneNumber(String phone) {
    if (phone.length < 4) return phone; // Nếu số quá ngắn, trả về nguyên gốc
    String firstTwo = phone.substring(0, 2); // 2 số đầu
    String lastTwo = phone.substring(phone.length - 2); // 2 số cuối
    int hiddenLength = phone.length - 4; // Số lượng số cần ẩn
    String hiddenPart = '*' * hiddenLength; // Tạo chuỗi * để ẩn
    return '(+84) $firstTwo$hiddenPart$lastTwo';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Danh sách địa chỉ',
          style: TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(1.0),
          child: Divider(color: Colors.grey.withOpacity(0.3), height: 1),
        ),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (!addresses.isEmpty) ...[
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => AddAddressUserScreen()),
                          );
                        },
                        child: Container(
                          child: Row(
                            children: [
                              Icon(Icons.add, color: Colors.black),
                              SizedBox(width: 8),
                              Text(
                                'Thêm địa chỉ',
                                style: TextStyle(fontSize: 16),
                              ),
                              Spacer(),
                              Icon(Icons.arrow_forward_ios,
                                  color: Colors.grey, size: 16),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 10),
                      Divider(color: Colors.grey.withOpacity(0.3)),
                      SizedBox(height: 16),
                    ],
                    addresses.isEmpty
                        ? _EmptyAddressWidget()
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: addresses.asMap().entries.map((entry) {
                              final index = entry.key;
                              final address = entry.value;
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              '${address['fullname']}',
                                              style: TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                            SizedBox(height: 8),
                                            Text(
                                              _formatPhoneNumber(address[
                                                  'phone']), // Định dạng số điện thoại
                                              style: TextStyle(fontSize: 14),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Text(
                                        'Chỉnh sửa',
                                        style: TextStyle(
                                          fontSize: 16,
                                          color: AppColors.primaryColor,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    '${address['street']}, ${address['precinct']}',
                                    style: TextStyle(fontSize: 14),
                                  ),
                                  Text(
                                    '${address['city']}, ${address['province']}',
                                    style: TextStyle(fontSize: 14),
                                  ),
                                  if (index < addresses.length - 1)
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 8.0),
                                      child: Divider(
                                          color: Colors.grey.withOpacity(0.3)),
                                    ),
                                ],
                              );
                            }).toList(),
                          ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _EmptyAddressWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.of(context).size.height - kToolbarHeight - 0,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/icons/no_location.png',
              width: 120,
              height: 120,
            ),
            SizedBox(height: 16),
            Text(
              'Chưa có thông tin vận chuyển',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 8),
            Text(
              'Thêm địa chỉ vận chuyển cho đơn hàng của bạn',
              style: TextStyle(fontSize: 14),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 200),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => AddAddressUserScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                side: BorderSide(color: Colors.grey.shade400),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(3),
                ),
                padding: EdgeInsets.symmetric(horizontal: 100, vertical: 22),
              ),
              child: Text(
                'Thêm',
                style: TextStyle(fontSize: 16, color: Colors.black),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
