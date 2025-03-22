import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/cart_controller.dart'; // Thêm import
import 'package:siegenx_mobile_app/screens/cart/cart_main_screen.dart';
import 'package:siegenx_mobile_app/screens/favorite_products_screen.dart';
import 'package:siegenx_mobile_app/screens/home/home_screen.dart';
import 'package:siegenx_mobile_app/screens/messenger_screen.dart';
import 'package:siegenx_mobile_app/screens/profile/profile_screen.dart';
import 'package:siegenx_mobile_app/utils/number_cart_product.dart'; // Thêm import
import 'package:siegenx_mobile_app/utils/cart_badge.dart'; // Import file mới

class ManagerScreen extends StatefulWidget {
  const ManagerScreen({super.key});

  @override
  State<ManagerScreen> createState() => _ManagerScreenState();
}

class _ManagerScreenState extends State<ManagerScreen> {
  int currentIndex = 0;
  int _cartItemCount = 0; // Thêm biến để lưu số lượng sản phẩm

  final List<Widget> screens = [
    const HomeScreen(),
    const FavoriteProductsScreen(),
    CartMainScreen(),
    ProfileScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _fetchCartItemCount(); // Lấy số lượng sản phẩm khi khởi tạo
  }

  Future<void> _fetchCartItemCount() async {
    try {
      final products = await CartController.fetchCartProducts(context);
      setState(() {
        _cartItemCount = calculateCartItemCount(products);
      });
    } catch (e) {
      print('Error fetching cart items: $e');
      setState(() {
        _cartItemCount = 0;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.white,
      body: IndexedStack(
        index: currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        margin: const EdgeInsets.all(20),
        height: size.width * .155,
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.15),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
          borderRadius: BorderRadius.circular(50),
        ),
        child: ListView.builder(
          itemCount: screens.length,
          scrollDirection: Axis.horizontal,
          padding: EdgeInsets.symmetric(horizontal: size.width * .024),
          itemBuilder: (context, index) => InkWell(
            onTap: () {
              if (index == 2) {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => CartMainScreen()),
                ).then((_) {
                  _fetchCartItemCount(); // Cập nhật lại số lượng khi quay về
                });
              } else {
                setState(() {
                  currentIndex = index;
                });
              }
            },
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 1500),
                  curve: Curves.fastLinearToSlowEaseIn,
                  margin: EdgeInsets.only(
                    bottom: index == currentIndex ? 0 : size.width * .029,
                    right: size.width * .0422,
                    left: size.width * .0422,
                  ),
                  width: size.width * .128,
                  height: index == currentIndex ? size.width * .014 : 0,
                  decoration: const BoxDecoration(
                    color: Color(0xff00B98E),
                    borderRadius: BorderRadius.vertical(
                      bottom: Radius.circular(10),
                    ),
                  ),
                ),
                index == 2
                    ? buildCartBadge(
                        cartItemCount: _cartItemCount,
                        icon: listOfIcons[index],
                        iconSize: size.width * .076,
                        iconColor: index == currentIndex
                            ? const Color(0xff00B98E)
                            : Colors.black38,
                      )
                    : Icon(
                        listOfIcons[index],
                        size: size.width * .076,
                        color: index == currentIndex
                            ? const Color(0xff00B98E)
                            : Colors.black38,
                      ),
                SizedBox(height: size.width * .03),
              ],
            ),
          ),
        ),
      ),
    );
  }

  List<IconData> listOfIcons = [
    Icons.home_rounded,
    Icons.favorite_rounded,
    Icons.shopping_bag,
    Icons.person_rounded,
  ];
}
