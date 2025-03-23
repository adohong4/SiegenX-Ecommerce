import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:siegenx_mobile_app/controllers/add_address_controller.dart';
import 'package:siegenx_mobile_app/controllers/logout_controller.dart'; // Thêm import LogoutController
import 'package:siegenx_mobile_app/models/address_model.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/controllers/view_profile_controller.dart';
import 'package:siegenx_mobile_app/screens/address/address_list_screen.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';

class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: const ProfilePage1(),
    );
  }
}

class ProfilePage1 extends StatefulWidget {
  const ProfilePage1({Key? key}) : super(key: key);

  @override
  _ProfilePage1State createState() => _ProfilePage1State();
}

class _ProfilePage1State extends State<ProfilePage1> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ViewProfileController>(context, listen: false)
          .fetchProfile(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ViewProfileController>(
      builder: (context, controller, child) {
        return Scaffold(
          body: controller.isLoading
              ? Center(child: CircularProgressIndicator())
              : Column(
                  children: [
                    Expanded(
                      flex: 2,
                      child: _TopPortion(
                          profilePic:
                              controller.profilePic), // Truyền profilePic
                    ),
                    Expanded(
                      flex: 3,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Center(
                              child: Text(
                                controller.username ??
                                    "Người dùng không xác định",
                                style: Theme.of(context)
                                    .textTheme
                                    .titleLarge
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(height: 10),
                            Expanded(
                              child: SingleChildScrollView(
                                child: _ProfileDetails(
                                  email: controller.email,
                                  fullName: controller.fullName,
                                  gender: controller.gender,
                                  numberPhone: controller.numberPhone,
                                  dateOfBirth: controller.dateOfBirth,
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
      },
    );
  }
}

class _ProfileDetails extends StatefulWidget {
  final String? email;
  final String? fullName; // Thêm fullName
  final String? gender; // Thêm gender
  final String? numberPhone; // Thêm numberPhone
  final String? dateOfBirth; // Thêm dateOfBirth

  const _ProfileDetails({
    Key? key,
    this.email,
    this.fullName,
    this.gender,
    this.numberPhone,
    this.dateOfBirth,
  }) : super(key: key);

  @override
  _ProfileDetailsState createState() => _ProfileDetailsState();
}

class _ProfileDetailsState extends State<_ProfileDetails> {
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
    final authProvider = Provider.of<AuthProvider>(context);
    final String? userId = authProvider.userId;
    final defaultAddress = _getDefaultAddress();

    final List<Map<String, String>> _details = [
      {"label": "User ID", "value": userId ?? "N/A"},
      {"label": "Email", "value": widget.email ?? "N/A"},
      {
        "label": "Họ và tên",
        "value": widget.fullName ?? "N/A"
      }, // Thêm fullName
      {"label": "Giới tính", "value": widget.gender ?? "N/A"}, // Thêm gender
      {
        "label": "Số điện thoại",
        "value": widget.numberPhone ?? "N/A"
      }, // Thêm numberPhone
      {
        "label": "Ngày sinh",
        "value": widget.dateOfBirth ?? "N/A"
      }, // Thêm dateOfBirth
    ];

    return Column(
      children: [
        ..._details
            .map(
              (detail) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Row(
                  children: [
                    Expanded(
                      flex: 4,
                      child: Text(
                        detail["label"]!,
                        style:
                            const TextStyle(color: Colors.grey, fontSize: 16),
                      ),
                    ),
                    Expanded(
                      flex: 6,
                      child: Text(
                        detail["value"]!,
                        style:
                            const TextStyle(color: Colors.black, fontSize: 16),
                      ),
                    ),
                  ],
                ),
              ),
            )
            .toList(),
        const Divider(),
        Row(
          children: [
            const Icon(Icons.location_on, color: AppColors.primaryColor),
            const SizedBox(width: 8),
            const Text(
              "Địa chỉ nhận hàng",
              style: TextStyle(fontSize: 14),
            ),
            const Spacer(),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => AddressListScreen()),
                ).then((_) {
                  _loadDefaultAddress();
                  _fetchAddresses();
                });
              },
              child: Row(
                children: [
                  Text(
                    "Thay đổi địa chỉ",
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF00B98E),
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.arrow_forward_ios,
                      color: Color(0xFF00B98E), size: 14),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Align(
          alignment: Alignment.centerLeft,
          child: isLoadingAddresses
              ? Text(
                  'Đang tải địa chỉ...',
                  style: TextStyle(fontSize: 14, color: Color(0xff808B96)),
                )
              : defaultAddress == null
                  ? Text(
                      'Chưa có địa chỉ mặc định',
                      style: TextStyle(fontSize: 14, color: Color(0xff808B96)),
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Expanded(
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
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
                                    _formatPhoneNumber(defaultAddress.phone),
                                    style: TextStyle(fontSize: 14),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 3),
                        Text(
                          '${defaultAddress.street}, ${defaultAddress.precinct}, ${defaultAddress.city}, ${defaultAddress.province}',
                          style:
                              TextStyle(fontSize: 14, color: Color(0xff808B96)),
                        ),
                      ],
                    ),
        ),
      ],
    );
  }
}

class _TopPortion extends StatelessWidget {
  final String? profilePic; // Thêm profilePic làm tham số

  const _TopPortion({Key? key, this.profilePic}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final logoutController = LogoutController();

    return Stack(
      fit: StackFit.expand,
      children: [
        Container(
          margin: const EdgeInsets.only(bottom: 50),
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [Color(0xff0043ba), Color(0xff006df1)],
            ),
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(50),
              bottomRight: Radius.circular(50),
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                top: 40,
                right: 16,
                child: IconButton(
                  icon: const Icon(Icons.logout, color: Colors.white, size: 28),
                  onPressed: () async {
                    await logoutController.logout(context);
                  },
                ),
              ),
            ],
          ),
        ),
        Align(
          alignment: Alignment.bottomCenter,
          child: SizedBox(
            width: 150,
            height: 150,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Colors.black,
                    shape: BoxShape.circle,
                    image: DecorationImage(
                      fit: BoxFit.cover,
                      image: profilePic != null && profilePic!.isNotEmpty
                          ? NetworkImage(profilePic!) // Sử dụng NetworkImage
                          : AssetImage('assets/avatars/cat.png')
                              as ImageProvider, // Fallback
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: CircleAvatar(
                    radius: 20,
                    backgroundColor: Color(0xffE1E2E3),
                    child: Icon(
                      Icons.edit,
                      color: Colors.black,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
