import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/controllers/view_profile_controller.dart';
import 'package:siegenx_mobile_app/screens/address/address_list_screen.dart'; // Import file mới

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
                    const Expanded(flex: 2, child: _TopPortion()),
                    Expanded(
                      flex: 3,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Center(
                              child: Text(
                                controller.username ?? "Không có tên",
                                style: Theme.of(context)
                                    .textTheme
                                    .titleLarge
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            Expanded(
                              child: SingleChildScrollView(
                                child: _ProfileDetails(email: controller.email),
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

  const _ProfileDetails({Key? key, this.email}) : super(key: key);

  @override
  _ProfileDetailsState createState() => _ProfileDetailsState();
}

class _ProfileDetailsState extends State<_ProfileDetails> {
  bool _isTokenExpanded = false;

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final String? userId = authProvider.userId;
    final String? token = authProvider.token;

    final List<Map<String, String>> _details = [
      {"label": "User ID", "value": userId ?? "N/A"},
      {"label": "Email", "value": widget.email ?? "N/A"},
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
                            const TextStyle(color: Colors.grey, fontSize: 14),
                      ),
                    ),
                    Expanded(
                      flex: 6,
                      child: Text(
                        detail["value"]!,
                        style:
                            const TextStyle(color: Colors.black, fontSize: 14),
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
            const Icon(Icons.local_shipping_outlined, color: Colors.black),
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
                );
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
        const Align(
          alignment: Alignment.centerLeft,
          child: Text(
            "136 Đốc Ngữ, Liễu Giai, Vĩnh Phú, Ba Đình, Hà Nội",
            style: TextStyle(fontSize: 14, color: Color(0xff808B96)),
          ),
        ),
      ],
    );
  }
}

class _TopPortion extends StatelessWidget {
  const _TopPortion({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
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
                  onPressed: () {
                    // Xử lý đăng xuất tại đây
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
                  decoration: const BoxDecoration(
                    color: Colors.black,
                    shape: BoxShape.circle,
                    image: DecorationImage(
                      fit: BoxFit.cover,
                      image: AssetImage('assets/avatars/cat.png'),
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
