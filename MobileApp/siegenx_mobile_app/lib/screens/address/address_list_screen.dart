import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:siegenx_mobile_app/controllers/add_address_controller.dart';
import 'package:siegenx_mobile_app/controllers/delete_address_controller.dart';
import 'package:siegenx_mobile_app/models/address_model.dart';
import 'package:siegenx_mobile_app/screens/address/add_address_user.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';

class AddressListScreen extends StatefulWidget {
  const AddressListScreen({Key? key}) : super(key: key);

  @override
  _AddressListScreenState createState() => _AddressListScreenState();
}

class _AddressListScreenState extends State<AddressListScreen> {
  List<AddressModel> addresses = [];
  bool isLoading = true;
  String? defaultAddressId;
  final AddAddressController _addAddressController = AddAddressController();
  final DeleteAddressController _deleteAddressController =
      DeleteAddressController();

  @override
  void initState() {
    super.initState();
    _loadDefaultAddress();
    _fetchAddresses();
  }

  Future<void> _loadDefaultAddress() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      defaultAddressId = prefs.getString('defaultAddressId');
    });
  }

  Future<void> _setDefaultAddress(String addressId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('defaultAddressId', addressId);
    setState(() {
      defaultAddressId = addressId;
    });
    // Quay về trang trước đó
    Navigator.pop(context);
  }

  Future<void> _fetchAddresses() async {
    setState(() {
      isLoading = true;
    });

    final fetchedAddresses =
        await _addAddressController.fetchAddresses(context);
    if (mounted) {
      setState(() {
        addresses = fetchedAddresses;
        isLoading = false;
        if (defaultAddressId == null && addresses.isNotEmpty) {
          _setDefaultAddress(
              addresses.first.id!); // Chọn mặc định và quay lại ProfileScreen
        }
      });
    }
  }

  String _formatPhoneNumber(String phone) {
    if (phone.length < 4) return phone;
    String firstTwo = phone.substring(0, 2);
    String lastTwo = phone.substring(phone.length - 2);
    int hiddenLength = phone.length - 4;
    String hiddenPart = '*' * hiddenLength;
    return '(+84) $firstTwo$hiddenPart$lastTwo';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Danh sách địa chỉ',
          style: TextStyle(fontWeight: FontWeight.w600),
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
                          ).then((_) => _fetchAddresses());
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
                              final isDefault = defaultAddressId == address.id;
                              return GestureDetector(
                                onTap: () {
                                  _setDefaultAddress(address
                                      .id!); // Chọn và quay lại ProfileScreen
                                },
                                child: Column(
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
                                                address.fullname,
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                              SizedBox(height: 8),
                                              Text(
                                                _formatPhoneNumber(
                                                    address.phone),
                                                style: TextStyle(fontSize: 14),
                                              ),
                                            ],
                                          ),
                                        ),
                                        GestureDetector(
                                          onTap: () {
                                            showDialog(
                                              context: context,
                                              builder: (dialogContext) =>
                                                  AlertDialog(
                                                title: Text('Xác nhận xóa'),
                                                content: Text(
                                                    'Bạn có chắc chắn muốn xóa địa chỉ này?'),
                                                actions: [
                                                  TextButton(
                                                    onPressed: () =>
                                                        Navigator.pop(
                                                            dialogContext),
                                                    child: Text('Hủy'),
                                                  ),
                                                  TextButton(
                                                    onPressed: () async {
                                                      Navigator.pop(
                                                          dialogContext);
                                                      final success =
                                                          await _deleteAddressController
                                                              .deleteAddress(
                                                                  context,
                                                                  address.id!);
                                                      if (mounted && success) {
                                                        if (isDefault) {
                                                          _setDefaultAddress(
                                                              addresses.length >
                                                                      1
                                                                  ? addresses[1]
                                                                      .id!
                                                                  : '');
                                                        } else {
                                                          _fetchAddresses();
                                                        }
                                                      }
                                                    },
                                                    child: Text('Xóa',
                                                        style: TextStyle(
                                                            color: Colors.red)),
                                                  ),
                                                ],
                                              ),
                                            );
                                          },
                                          child: Row(
                                            children: [
                                              Text(
                                                'Xóa',
                                                style: TextStyle(
                                                  fontSize: 16,
                                                  color: Colors.redAccent,
                                                ),
                                              ),
                                              SizedBox(width: 3),
                                              Icon(
                                                Icons.delete,
                                                color: Colors.red,
                                                size: 22,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 8),
                                    Text(
                                      '${address.street}, ${address.precinct}',
                                      style: TextStyle(fontSize: 14),
                                    ),
                                    Text(
                                      '${address.city}, ${address.province}',
                                      style: TextStyle(fontSize: 14),
                                    ),
                                    if (isDefault)
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(top: 4.0),
                                        child: Container(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: Colors.grey[300],
                                            borderRadius:
                                                BorderRadius.circular(5),
                                          ),
                                          child: Text(
                                            'Chọn mặc định',
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: AppColors.primaryColor,
                                            ),
                                          ),
                                        ),
                                      ),
                                    if (index < addresses.length - 1)
                                      Padding(
                                        padding: const EdgeInsets.symmetric(
                                            vertical: 8.0),
                                        child: Divider(
                                            color:
                                                Colors.grey.withOpacity(0.3)),
                                      ),
                                  ],
                                ),
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
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
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
                ).then((_) =>
                    context.read<_AddressListScreenState>()._fetchAddresses());
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                side: BorderSide(color: Colors.grey.shade400),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(3)),
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
