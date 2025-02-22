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
    );
  }
}
