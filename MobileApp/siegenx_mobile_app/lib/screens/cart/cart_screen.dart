import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/product_service.dart';
import 'package:siegenx_mobile_app/widgets/cart_product_grid.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';

class CartScreen extends StatefulWidget {
  CartScreen({super.key});

  @override
  _CartScreenState createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final ValueNotifier<bool> _selectAllNotifier = ValueNotifier(false);
  late Future<List<Product>> _productsFuture;

  @override
  void initState() {
    super.initState();
    _productsFuture = ProductService.fetchAllProducts(); // Gọi API một lần
  }

  void _toggleSelectAll(bool? value) {
    _selectAllNotifier.value = value ?? false;
  }

  // Hàm tính tổng tiền sản phẩm
  double calculateTotalPrice(List<Product> products) {
    // Đổi thành int vì price là int
    double total = 0;
    for (var product in products) {
      if (product.quantity > 0) {
        total += product.price * product.quantity; // Dùng price trực tiếp
      }
    }
    return total;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            ValueListenableBuilder<bool>(
              valueListenable: _selectAllNotifier,
              builder: (context, selectAll, child) {
                return CartProductGrid(
                  selectAll: selectAll,
                  onSelectionChange: (bool allSelected) {
                    _selectAllNotifier.value = allSelected;
                  },
                );
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: FutureBuilder<List<Product>>(
        future: _productsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Container(
              padding: EdgeInsets.all(10),
              child: Center(child: CircularProgressIndicator()),
            );
          } else if (snapshot.hasError) {
            return Container(
              padding: EdgeInsets.all(10),
              child: Center(child: Text('Error: ${snapshot.error}')),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Container(
              padding: EdgeInsets.all(10),
              child: Center(child: Text('No products in cart')),
            );
          }

          final cartProducts =
              snapshot.data!.where((product) => product.quantity > 0).toList();
          int quantityCount = cartProducts.length;
          double totalPrice =
              calculateTotalPrice(cartProducts); // Đổi thành int

          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey, width: 0.5)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ValueListenableBuilder<bool>(
                  valueListenable: _selectAllNotifier,
                  builder: (context, selectAll, child) {
                    return Row(
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            shape: const CircleBorder(),
                            value: selectAll,
                            activeColor: Colors.green,
                            onChanged: _toggleSelectAll,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text("Tất cả"),
                      ],
                    );
                  },
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          formatCurrency(totalPrice), // Không cần .round()
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const Text("Phí vận chuyển: 0đ"),
                        // Bỏ hiển thị "Giảm giá" vì không còn totalDiscount
                      ],
                    ),
                    const SizedBox(width: 10),
                    SizedBox(
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {},
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text(
                              "Thanh toán",
                              style:
                                  TextStyle(fontSize: 12, color: Colors.white),
                            ),
                            Text(
                              "($quantityCount)",
                              style: const TextStyle(
                                  fontSize: 12, color: Colors.white),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
