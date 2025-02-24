import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/widgets/cart_product_grid.dart';
import 'package:siegenx_mobile_app/test/sample_products.dart';

class CartScreen extends StatelessWidget {
  final ValueNotifier<bool> _selectAllNotifier = ValueNotifier(false);

  CartScreen({super.key});

  void _toggleSelectAll(bool? value) {
    _selectAllNotifier.value = value ?? false;
  }

  // Hàm tính tổng tiền sản phẩm đã giảm giá
  double calculateTotalPrice() {
    double total = 0;
    for (var product in sampleProducts) {
      if (product.quantity > 0) {
        double discountedPrice =
            product.price * (1 - product.discountPercentage / 100);
        total += discountedPrice * product.quantity;
      }
    }
    return total;
  }

  // Hàm tính tổng số tiền đã giảm giá
  double calculateTotalDiscount() {
    double totalDiscount = 0;
    for (var product in sampleProducts) {
      if (product.quantity > 0) {
        double discountAmount =
            (product.price * product.discountPercentage / 100) *
                product.quantity;
        totalDiscount += discountAmount;
      }
    }
    return totalDiscount;
  }

  @override
  Widget build(BuildContext context) {
    int quantityCount =
        sampleProducts.where((product) => product.quantity > 0).length;
    double totalPrice = calculateTotalPrice();
    double totalDiscount =
        calculateTotalDiscount(); // Tính tổng số tiền đã giảm

    return Scaffold(
      appBar: AppBar(
        title: Text("Giỏ hàng ($quantityCount)"),
        centerTitle: true,
      ),
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
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Colors.grey, width: 0.5)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Cột 1: Checkbox + Tất cả
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
            // Cột 2 + Cột 3: Thông tin giá + Button Thanh toán
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      formatCurrency(totalPrice.toInt()), // Tổng tiền đã giảm
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const Text("Phí vận chuyển: 0đ"),
                    Text(
                      "Giảm ${formatCurrency(totalDiscount.toInt())}", // Tổng tiền đã giảm giá
                      style: const TextStyle(fontSize: 12, color: Colors.red),
                    ),
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
                          style: TextStyle(fontSize: 12, color: Colors.white),
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
      ),
    );
  }
}
