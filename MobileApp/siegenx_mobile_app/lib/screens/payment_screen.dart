// payment_screen.dart
import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/add_address_controller.dart';
import 'package:siegenx_mobile_app/models/address_model.dart';
import 'package:siegenx_mobile_app/screens/address/address_list_screen.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PaymentScreen extends StatefulWidget {
  final double totalPrice;
  final int selectedCount;

  const PaymentScreen({
    super.key,
    required this.totalPrice,
    required this.selectedCount,
  });

  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  List<AddressModel> addresses = [];
  String? defaultAddressId;
  bool isLoadingAddresses = true;
  final AddAddressController _addAddressController = AddAddressController();

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

  Future<void> _fetchAddresses() async {
    setState(() {
      isLoadingAddresses = true;
    });

    final fetchedAddresses =
        await _addAddressController.fetchAddresses(context);
    if (mounted) {
      setState(() {
        addresses = fetchedAddresses;
        isLoadingAddresses = false;
      });
    }
  }

  AddressModel? _getDefaultAddress() {
    if (addresses.isEmpty) return null;
    return addresses.firstWhere(
      (address) => address.id == defaultAddressId,
      orElse: () =>
          addresses.first, // Lấy địa chỉ đầu tiên nếu không tìm thấy mặc định
    );
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
    final defaultAddress = _getDefaultAddress();

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.black,
            size: 18,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Tổng quan đơn hàng',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 3),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(
                  'assets/icons/verified.png',
                  width: 13,
                  height: 13,
                ),
                const SizedBox(width: 4),
                Text(
                  'Thông tin của bạn sẽ được bảo mật và mã hóa',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.primaryColor,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ],
        ),
        actions: [
          SizedBox(width: 48), // Widget rỗng để cân bằng với leading
        ],
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          Container(
            height: 1,
            color: Colors.grey[300],
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Phần địa chỉ nhận hàng
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => AddressListScreen()),
                      ).then((_) => _fetchAddresses());
                    },
                    child: Container(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(Icons.location_on,
                              color: AppColors.primaryColor),
                          const SizedBox(width: 8),
                          Expanded(
                            child: isLoadingAddresses
                                ? Text(
                                    'Đang tải địa chỉ...',
                                    style: TextStyle(
                                        fontSize: 14, color: Color(0xff808B96)),
                                  )
                                : defaultAddress == null
                                    ? Text(
                                        'Chưa có địa chỉ mặc định',
                                        style: TextStyle(
                                            fontSize: 14,
                                            color: Color(0xff808B96)),
                                      )
                                    : Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                defaultAddress.fullname,
                                                style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                              const SizedBox(width: 10),
                                              Text(
                                                _formatPhoneNumber(
                                                    defaultAddress.phone),
                                                style: TextStyle(fontSize: 14),
                                              ),
                                            ],
                                          ),
                                          SizedBox(height: 3),
                                          Text(
                                            '${defaultAddress.street}, ${defaultAddress.precinct}, ${defaultAddress.city}, ${defaultAddress.province}',
                                            style: TextStyle(
                                                fontSize: 14,
                                                color: Color(0xff808B96)),
                                          ),
                                        ],
                                      ),
                          ),
                          // const Spacer(), // Đẩy icon mũi tên sang bên phải
                          Column(
                            children: [
                              const SizedBox(
                                height: 5,
                              ),
                              Icon(
                                Icons.arrow_forward_ios,
                                color: Colors.grey,
                                size: 18,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Divider(
                      height: 1, color: Colors.grey[300]), // Đường kẻ ngăn cách
                  const SizedBox(height: 16),

                  // Phần thông tin thanh toán
                  Text(
                    'Thông tin thanh toán',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 20),
                  Text('Số lượng sản phẩm: ${widget.selectedCount}'),
                  Text('Tổng tiền: ${formatCurrency(widget.totalPrice)}'),
                  const Text('Phí vận chuyển: 50.000 đ'),
                  const Divider(height: 30),
                  Text(
                    'Tổng thanh toán: ${formatCurrency(widget.totalPrice + 50000)}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textColorRed,
                    ),
                  ),
                  const Spacer(),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text('Thanh toán thành công!')),
                        );
                      },
                      child: const Text(
                        'Xác nhận thanh toán',
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
