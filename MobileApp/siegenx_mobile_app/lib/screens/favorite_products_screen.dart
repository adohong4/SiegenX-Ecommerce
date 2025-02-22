import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/widgets/facorite_product_grid.dart';
import 'package:siegenx_mobile_app/test/sample_products.dart';

class FavoriteProductsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Đếm số sản phẩm yêu thích
    int favoriteCount =
        sampleProducts.where((product) => product.isFavorite).length;

    return Scaffold(
      appBar: AppBar(
        title: Text("Sản phẩm yêu thích ($favoriteCount)"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            FavoriteProductGrid(), // Gọi danh sách sản phẩm yêu thích
          ],
        ),
      ),
    );
  }
}
