import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/controllers/favorites_manager.dart';
import 'package:siegenx_mobile_app/widgets/facorite_product_grid.dart';
import 'package:siegenx_mobile_app/services/product_service.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';

class FavoriteProductsScreen extends StatefulWidget {
  @override
  _FavoriteProductsScreenState createState() => _FavoriteProductsScreenState();
}

class _FavoriteProductsScreenState extends State<FavoriteProductsScreen> {
  late Future<List<Product>> _productsFuture;
  List<int> favoriteProductIds = [];

  @override
  void initState() {
    super.initState();
    _productsFuture = ProductService.fetchAllProducts();
    _loadFavorites();
  }

  Future<void> _loadFavorites() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId ?? "guest";
    final favorites = await FavoritesManager.getFavorites(userId);
    setState(() {
      favoriteProductIds = favorites;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: FutureBuilder<List<Product>>(
          future: _productsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Text("Sản phẩm yêu thích (Đang tải...)");
            } else if (snapshot.hasError) {
              return Text("Sản phẩm yêu thích (Lỗi)");
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Text("Sản phẩm yêu thích (0)");
            }

            int favoriteCount = snapshot.data!
                .where((product) => favoriteProductIds.contains(product.id))
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
