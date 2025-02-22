import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/widgets/facorite_product_grid.dart';

class FavoriteProductsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Favorite Products")),
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
