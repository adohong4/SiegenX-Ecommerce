import 'package:flutter/material.dart';
import 'package:provider/provider.dart'; // Import Provider
import 'package:siegenx_mobile_app/controllers/add_address_controller.dart';
import 'package:siegenx_mobile_app/controllers/payment_controller.dart';
import 'package:siegenx_mobile_app/models/address_model.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/screens/address/address_list_screen.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/widgets/cart_product_grid.dart';

class PaymentScreen extends StatefulWidget {
  final double totalPrice;
  final int selectedCount;
  final List<Product> selectedProducts;

  const PaymentScreen({
    super.key,
    required this.totalPrice,
    required this.selectedCount,
    required this.selectedProducts,
  });

  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  List<AddressModel> addresses = [];
  bool isLoadingAddresses = true;
  final AddAddressController _addAddressController = AddAddressController();
  bool isCodSelected = true;
  bool isZaloPaySelected = false;

  @override
  void initState() {
    super.initState();
    _fetchAddresses();
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
    // Nếu AuthProvider không có defaultAddressId, lấy địa chỉ đầu tiên làm mặc định
    return addresses.first;
    // Nếu bạn thêm defaultAddressId vào AuthProvider, thay bằng logic sau:
    // final authProvider = Provider.of<AuthProvider>(context, listen: false);
    // return addresses.firstWhere(
    //   (address) => address.id == authProvider.defaultAddressId,
    //   orElse: () => addresses.first,
    // );
  }

  String _formatPhoneNumber(String phone) {
    if (phone.length < 4) return phone;
    String firstTwo = phone.substring(0, 2);
    String lastTwo = phone.substring(phone.length - 2);
    int hiddenLength = phone.length - 4;
    String hiddenPart = '*' * hiddenLength;
    return '(+84) $firstTwo$hiddenPart$lastTwo';
  }

  Future<void> _placeOrder() async {
    final defaultAddress = _getDefaultAddress();
    if (defaultAddress == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chọn địa chỉ giao hàng!')),
      );
      return;
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final token = authProvider.token;

    final Map<String, dynamic> orderData = {
      "address": {
        "fullname": defaultAddress.fullname,
        "email": authProvider.email ??
            "test01@gmail.com", // Sử dụng email từ AuthProvider nếu có
        "street": defaultAddress.street,
        "precinct": defaultAddress.precinct,
        "city": defaultAddress.city,
        "province": defaultAddress.province,
        "_id": defaultAddress.id,
      },
      "amount": widget.totalPrice + 50000,
      "items": widget.selectedProducts
          .map((product) => {
                "itemId": product.id,
                "title": product.title,
                "nameProduct": product.nameProduct,
                "product_slug": product.productSlug ??
                    product.nameProduct.toLowerCase().replaceAll(' ', '-'),
                "price": product.price,
                "quantity": product.quantity,
              })
          .toList(),
    };

    try {
      print('Token before placing order: $token'); // Debug token

      if (token == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Vui lòng đăng nhập để đặt hàng!')),
        );
        return;
      }

      final response = await PaymentController.placeCodOrder(
        token: token,
        orderData: orderData,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(response['message'])),
      );
      Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final defaultAddress = _getDefaultAddress();

    DateTime now = DateTime.now();
    DateTime deliveryStart = now.add(Duration(days: 3));
    DateTime deliveryEnd = now.add(Duration(days: 4));

    String formatDate(DateTime date) {
      return '${date.day}/${date.month}';
    }

    String deliveryText =
        'Đảm bảo giao hàng: ${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}';

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new,
              color: Colors.black, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Tổng quan đơn hàng',
                style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.black)),
            const SizedBox(height: 3),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset('assets/icons/verified.png', width: 13, height: 13),
                const SizedBox(width: 4),
                Text('Thông tin của bạn sẽ được bảo mật và mã hóa',
                    style:
                        TextStyle(fontSize: 10, color: AppColors.primaryColor),
                    overflow: TextOverflow.ellipsis),
              ],
            ),
          ],
        ),
        actions: [SizedBox(width: 48)],
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          Container(height: 1, color: Colors.grey[300]),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
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
                                        builder: (context) =>
                                            AddressListScreen()))
                                .then((_) => _fetchAddresses());
                          },
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(Icons.location_on,
                                  color: AppColors.primaryColor),
                              const SizedBox(width: 8),
                              Expanded(
                                child: isLoadingAddresses
                                    ? Text('Đang tải địa chỉ...',
                                        style: TextStyle(
                                            fontSize: 14,
                                            color: Color(0xff808B96)))
                                    : defaultAddress == null
                                        ? Text('Chưa có địa chỉ mặc định',
                                            style: TextStyle(
                                                fontSize: 14,
                                                color: Color(0xff808B96)))
                                        : Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Text(defaultAddress.fullname,
                                                      style: TextStyle(
                                                          fontSize: 16,
                                                          fontWeight:
                                                              FontWeight.w600)),
                                                  const SizedBox(width: 10),
                                                  Text(
                                                      _formatPhoneNumber(
                                                          defaultAddress.phone),
                                                      style: TextStyle(
                                                          fontSize: 14)),
                                                ],
                                              ),
                                              SizedBox(height: 3),
                                              Text(
                                                  '${defaultAddress.street}, ${defaultAddress.precinct}, ${defaultAddress.city}, ${defaultAddress.province}',
                                                  style: TextStyle(
                                                      fontSize: 14,
                                                      color:
                                                          Color(0xff808B96))),
                                            ],
                                          ),
                              ),
                              Column(
                                children: [
                                  const SizedBox(height: 5),
                                  Icon(Icons.arrow_forward_ios,
                                      color: Colors.grey, size: 18),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        Divider(height: 1, color: Colors.grey[300]),
                        const SizedBox(height: 10),
                        CartProductGrid(
                            cartProducts: widget.selectedProducts,
                            onCartUpdated: () {}),
                      ],
                    ),
                  ),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    color: Color(0xffD1F2EB),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(deliveryText,
                            style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Colors.black)),
                        const SizedBox(height: 10),
                        Text('Vận chuyển tiêu chuẩn',
                            style:
                                TextStyle(fontSize: 14, color: Colors.black)),
                        const SizedBox(height: 10),
                        Text('Nhận voucher giảm giá nếu đơn hàng bị giao muộn',
                            style:
                                TextStyle(fontSize: 14, color: Colors.black)),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Tóm tắt đơn hàng',
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 10),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Tổng phụ', style: TextStyle(fontSize: 14)),
                              Text(formatCurrency(widget.totalPrice),
                                  style: TextStyle(fontSize: 14)),
                            ]),
                        const SizedBox(height: 8),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Vận chuyển',
                                  style: TextStyle(fontSize: 14)),
                              Text('50.000 đ', style: TextStyle(fontSize: 14)),
                            ]),
                        const SizedBox(height: 10),
                        Divider(height: 1, color: Colors.grey[300]),
                        const SizedBox(height: 10),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Tổng', style: TextStyle(fontSize: 14)),
                              Text(formatCurrency(widget.totalPrice + 50000),
                                  style: TextStyle(fontSize: 14)),
                            ]),
                      ],
                    ),
                  ),
                  Container(height: 20, color: Colors.grey[300]),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Phương thức thanh toán',
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 10),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(children: [
                                Image.asset('assets/icons/bank.png',
                                    width: 30, height: 30),
                                const SizedBox(width: 10),
                                Text('Thanh toán khi nhận hàng',
                                    style: TextStyle(fontSize: 14)),
                              ]),
                              Checkbox(
                                value: isCodSelected,
                                onChanged: (bool? value) {
                                  setState(() {
                                    isCodSelected = value ?? false;
                                    if (isCodSelected)
                                      isZaloPaySelected = false;
                                  });
                                },
                                shape: CircleBorder(),
                                activeColor: Colors.green,
                                checkColor: Colors.white,
                              ),
                            ]),
                        const SizedBox(height: 8),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(children: [
                                Image.asset('assets/icons/zalo.png',
                                    width: 30, height: 30),
                                const SizedBox(width: 8),
                                Text('Zalopay (******1103)',
                                    style: TextStyle(fontSize: 14)),
                              ]),
                              Checkbox(
                                value: isZaloPaySelected,
                                onChanged: (bool? value) {
                                  setState(() {
                                    isZaloPaySelected = value ?? false;
                                    if (isZaloPaySelected)
                                      isCodSelected = false;
                                  });
                                },
                                shape: CircleBorder(),
                                activeColor: Colors.green,
                                checkColor: Colors.white,
                              ),
                            ]),
                      ],
                    ),
                  ),
                  SizedBox(height: 40),
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
            border:
                Border(top: BorderSide(color: Colors.grey[300]!, width: 1))),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text('Tổng (${widget.selectedCount} mặt hàng)',
                    style: const TextStyle(fontSize: 14, color: Colors.black)),
                Text(formatCurrency(widget.totalPrice + 50000),
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            SizedBox(width: 20),
            SizedBox(
              width: 150,
              height: 45,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryColor,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () async {
                  if (isCodSelected) {
                    await _placeOrder();
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text(
                              'Vui lòng chọn phương thức thanh toán khi nhận hàng!')),
                    );
                  }
                },
                child: const Text('Đặt hàng',
                    style: TextStyle(fontSize: 16, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
