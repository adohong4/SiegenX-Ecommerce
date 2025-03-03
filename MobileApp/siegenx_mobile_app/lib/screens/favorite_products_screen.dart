import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/widgets/facorite_product_grid.dart';
import 'package:siegenx_mobile_app/services/product_service.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/providers/favorites_provider.dart';

class FavoriteProductsScreen extends StatelessWidget {
  const FavoriteProductsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final userId = authProvider.userId ?? "guest";
    final favoritesProvider = Provider.of<FavoritesProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: FutureBuilder<List<Product>>(
          future: ProductService.fetchAllProducts(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Text("Sản phẩm yêu thích (Đang tải...)");
            } else if (snapshot.hasError) {
              return Text("Sản phẩm yêu thích (Lỗi)");
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Text("Sản phẩm yêu thích (0)");
            }

            final favorites = favoritesProvider.getFavorites(userId);
            int favoriteCount = snapshot.data!
                .where((product) => favorites.contains(product.id))
                .length;

            return Text("Sản phẩm yêu thích ($favoriteCount)");
          },
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            FavoriteProductGrid(),
          ],
        ),
      ),
    );
  }
}
