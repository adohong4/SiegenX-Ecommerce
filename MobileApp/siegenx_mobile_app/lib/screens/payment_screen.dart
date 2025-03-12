// payment_screen.dart
import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/add_address_controller.dart';
import 'package:siegenx_mobile_app/models/address_model.dart';
import 'package:siegenx_mobile_app/models/product.dart'; // Thêm import Product
import 'package:siegenx_mobile_app/screens/address/address_list_screen.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:siegenx_mobile_app/widgets/cart_product_grid.dart'; // Thêm import CartProductGrid

class PaymentScreen extends StatefulWidget {
  final double totalPrice;
  final int selectedCount;
  final List<Product> selectedProducts; // Thêm danh sách sản phẩm đã chọn

  const PaymentScreen({
    super.key,
    required this.totalPrice,
    required this.selectedCount,
    required this.selectedProducts, // Thêm vào constructor
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
      orElse: () => addresses.first,
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

    // Tính toán ngày giao hàng
    DateTime now = DateTime.now();
    DateTime deliveryStart = now.add(Duration(days: 3)); // Cộng 3 ngày
    DateTime deliveryEnd = now.add(Duration(days: 4)); // Cộng 4 ngày

    // Hàm định dạng ngày tháng
    String formatDate(DateTime date) {
      return '${date.day}/${date.month}';
    }

    // Chuỗi ngày giao hàng
    String deliveryText =
        'Đảm bảo giao hàng: ${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}';

    // State để quản lý checkbox
    bool isCodSelected = true; // Mặc định chọn "Thanh toán khi nhận hàng"
    bool isZaloPaySelected = false;

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
          SizedBox(width: 48),
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
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Phần địa chỉ nhận hàng với padding
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => AddressListScreen()),
                            ).then((_) => _fetchAddresses());
                          },
                          child: Row(
                            // ... (giữ nguyên nội dung GestureDetector)
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
                                            fontSize: 14,
                                            color: Color(0xff808B96)),
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
                                                      fontWeight:
                                                          FontWeight.w600,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 10),
                                                  Text(
                                                    _formatPhoneNumber(
                                                        defaultAddress.phone),
                                                    style:
                                                        TextStyle(fontSize: 14),
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
                              Column(
                                children: [
                                  const SizedBox(height: 5),
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
                        const SizedBox(height: 16),
                        Divider(height: 1, color: Colors.grey[300]),
                        const SizedBox(height: 10),
                        CartProductGrid(
                          // ... (giữ nguyên CartProductGrid)
                          cartProducts: widget.selectedProducts,
                          onCartUpdated: () {},
                        ),
                      ],
                    ),
                  ),
                  // Container thông tin giao hàng full chiều ngang
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    color: Color(0xffD1F2EB),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          deliveryText,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Vận chuyển tiêu chuẩn',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Nhận voucher giảm giá nếu đơn hàng bị giao muộn',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.black,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Phần thông tin thanh toán với padding
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Tóm tắt đơn hàng',
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Tổng phụ',
                              style: TextStyle(fontSize: 14),
                            ),
                            Text(
                              formatCurrency(widget.totalPrice),
                              style: TextStyle(fontSize: 14),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Vận chuyển',
                              style: TextStyle(fontSize: 14),
                            ),
                            Text(
                              '50.000 đ',
                              style: TextStyle(fontSize: 14),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Divider(height: 1, color: Colors.grey[300]),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Tổng',
                              style: TextStyle(
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              formatCurrency(widget.totalPrice + 50000),
                              style: TextStyle(
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Đường kẻ full ngang với chiều cao 5px
                  Container(
                    height: 20,
                    color: Colors.grey[300],
                  ),

                  // Phần phương thức thanh toán
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Phương thức thanh toán',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Image.asset(
                                  'assets/icons/bank.png',
                                  width: 30,
                                  height: 30,
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  'Thanh toán khi nhận hàng',
                                  style: TextStyle(fontSize: 14),
                                ),
                              ],
                            ),
                            Checkbox(
                              value: isCodSelected,
                              onChanged: (bool? value) {
                                if (!isCodSelected && !isZaloPaySelected) {
                                  // Chỉ cho chọn khi chưa chọn gì
                                  setState(() {
                                    isCodSelected = true;
                                  });
                                }
                              },
                              shape: CircleBorder(), // Checkbox hình tròn
                              activeColor: Colors.green, // Màu xanh khi chọn
                              checkColor: Colors.white, // Màu dấu check
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Image.asset(
                                  'assets/icons/zalo.png',
                                  width: 30,
                                  height: 30,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'Zalopay (******1103)',
                                  style: TextStyle(fontSize: 14),
                                ),
                              ],
                            ),
                            Checkbox(
                              value: isZaloPaySelected,
                              onChanged: (bool? value) {
                                if (!isCodSelected && !isZaloPaySelected) {
                                  // Chỉ cho chọn khi chưa chọn gì
                                  setState(() {
                                    isZaloPaySelected = true;
                                  });
                                }
                              },
                              shape: CircleBorder(), // Checkbox hình tròn
                              activeColor: Colors.green, // Màu xanh khi chọn
                              checkColor: Colors.white, // Màu dấu check
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 40,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
            top: BorderSide(color: Colors.grey[300]!, width: 1),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            // Cột bên trái
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  'Tổng (${widget.selectedCount} mặt hàng)',
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.black,
                  ),
                ),
                Text(
                  formatCurrency(widget.totalPrice + 50000),
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            SizedBox(
              width: 20,
            ),
            // Cột bên phải
            SizedBox(
              width: 150, // Điều chỉnh độ rộng của button
              height: 45,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Thanh toán thành công!')),
                  );
                },
                child: const Text(
                  'Đặt hàng',
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
              ),
            ),
            // SizedBox(
            //   width: 16,
            // ),
          ],
        ),
      ),
    );
  }
}
