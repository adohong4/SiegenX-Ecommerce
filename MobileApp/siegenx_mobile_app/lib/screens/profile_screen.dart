import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: const ProfilePage1(),
    );
  }
}

class ProfilePage1 extends StatelessWidget {
  const ProfilePage1({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
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
                      "Nguyễn Hoàng",
                      style: Theme.of(context)
                          .textTheme
                          .titleLarge
                          ?.copyWith(fontWeight: FontWeight.bold),
                    ),
                  ),
                  const _ProfileDetails(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileDetails extends StatelessWidget {
  const _ProfileDetails({Key? key}) : super(key: key);

  final List<Map<String, String>> _details = const [
    {"label": "Email", "value": "user@gmail.com"},
    {"label": "Số điện thoại", "value": "0912.234.568"},
    {"label": "Ngày sinh", "value": "01/01/2024"},
    {"label": "Giới tính", "value": "Nam"},
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ..._details
            .map(
              (detail) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      detail["label"]!,
                      style: const TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                    Text(
                      detail["value"]!,
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 14,
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
              // Nút đăng xuất ở góc phải trên cùng
              Positioned(
                top:
                    40, // Điều chỉnh vị trí xuống một chút để tránh bị che khuất
                right: 16, // Cách mép phải 16px
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
                        image: NetworkImage(
                            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8&auto=format&fit=crop&w=1470&q=80')),
                  ),
                ),
                Positioned(
                  bottom: 0, // Dịch xuống một chút để trông cân đối hơn
                  right: 0, // Dịch sang phải để chồng lên avatar
                  child: CircleAvatar(
                    radius: 20, // Tăng kích thước lớn hơn
                    backgroundColor: Color(0xffF2F3F4), // Màu nền trắng
                    child: Icon(
                      Icons.edit, // Icon chỉnh sửa
                      color: Colors.black, // Màu icon
                      size: 20, // Kích thước icon
                    ),
                  ),
                ),
              ],
            ),
          ),
        )
      ],
    );
  }
}
