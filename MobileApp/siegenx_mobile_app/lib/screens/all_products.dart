import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/widgets/product_grid.dart'; // Import ProductGrid

class AllProducts extends StatefulWidget {
  const AllProducts({super.key});

  @override
  State<AllProducts> createState() => _AllProductsState();
}

class _AllProductsState extends State<AllProducts> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Tất cả sản phẩm"),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(10.0),
          child: ProductGrid(), // Gọi Widget hiển thị danh sách sản phẩm
        ),
      ),
    );
  }
}
