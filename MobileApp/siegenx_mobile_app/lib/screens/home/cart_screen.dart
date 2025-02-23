import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/widgets/cart_product_grid.dart';
import 'package:siegenx_mobile_app/test/sample_products.dart';

class CartScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Đếm số sản phẩm có quantity >= 0
    int quantityCount =
        sampleProducts.where((product) => product.quantity > 0).length;

    return Scaffold(
      appBar: AppBar(
        title: Text("Giỏ hàng ($quantityCount)"), // Cập nhật số sản phẩm
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            CartProductGrid(), // Gọi danh sách sản phẩm trong giỏ hàng
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Colors.grey, width: 0.5)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Cột 1: Checkbox + Tất cả
            Row(
              children: [
                Checkbox(value: false, onChanged: (bool? value) {}),
                Text("Tất cả"),
              ],
            ),
            // Cột 2: Thông tin giá
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text("52.500.000 đ",
                    style: TextStyle(fontWeight: FontWeight.bold)),
                Text("Phí vận chuyển: 0đ"),
                Text("Giảm: 22.000.000 đ", style: TextStyle(color: Colors.red)),
              ],
            ),
            // Cột 3: Button Thanh toán
            SizedBox(
              height: 50, // Giới hạn chiều cao nút
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: EdgeInsets.symmetric(horizontal: 20),
                ),
                onPressed: () {},
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text("Thanh toán", style: TextStyle(color: Colors.white)),
                    Text("(3)", style: TextStyle(color: Colors.white)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
