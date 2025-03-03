import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/controllers/favorites_manager.dart';
import 'package:siegenx_mobile_app/services/product_service.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/utils/dialog_utils.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';

class FavoriteProductGrid extends StatefulWidget {
  const FavoriteProductGrid({Key? key}) : super(key: key);

  @override
  _FavoriteProductGridState createState() => _FavoriteProductGridState();
}

class _FavoriteProductGridState extends State<FavoriteProductGrid> {
  List<int> favoriteProductIds = [];

  @override
  void initState() {
    super.initState();
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

  Future<void> _toggleFavorite(int productId) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId ?? "guest";
    if (favoriteProductIds.contains(productId)) {
      await FavoritesManager.removeFavorite(userId, productId);
    } else {
      await FavoritesManager.addFavorite(userId, productId);
    }
    await _loadFavorites();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.0),
      child: FutureBuilder<List<Product>>(
        future: ProductService.fetchAllProducts(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No favorite products found'));
          }

          final favoriteProducts = snapshot.data!
              .where((product) => favoriteProductIds.contains(product.id))
              .toList();

          if (favoriteProducts.isEmpty) {
            return Center(child: Text('No favorite products found'));
          }

          return ListView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: favoriteProducts.length,
            itemBuilder: (context, index) {
              final product = favoriteProducts[index];
              final isFavorite = favoriteProductIds.contains(product.id);

              return GestureDetector(
                onLongPress: () {
                  showProductDialog(context, product);
                },
                child: Container(
                  margin: EdgeInsets.only(bottom: 12),
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.1),
                        blurRadius: 5,
                        spreadRadius: 1,
                      )
                    ],
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          '${ApiService.imageBaseUrl}${product.imageUrl[0]}',
                          width: 90,
                          height: 90,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              Icon(Icons.error),
                        ),
                      ),
                      SizedBox(width: 5),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    product.name,
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.black,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                SizedBox(width: 3),
                                GestureDetector(
                                  onTap: () async {
                                    await _toggleFavorite(product.id);
                                  },
                                  child: Icon(
                                    isFavorite
                                        ? Icons.favorite
                                        : Icons.favorite_border,
                                    color: isFavorite
                                        ? Color(0xFFEC7063)
                                        : Colors.grey[400],
                                    size: 20,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 4),
                            Text(
                              formatCurrency(product.price),
                              style: TextStyle(
                                fontSize: 15,
                                color: Color(0xFF00B98E),
                              ),
                            ),
                            SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Số lượng: ${product.quantity}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.black54,
                                  ),
                                ),
                                Row(
                                  children: [
                                    IconButton(
                                      icon: Icon(
                                          Icons.add_shopping_cart_rounded,
                                          color: Colors.black,
                                          size: 20),
                                      onPressed: () {
                                        // TODO: Thêm chức năng giỏ hàng
                                      },
                                    ),
                                    SizedBox(width: 5),
                                    ElevatedButton(
                                      onPressed: () {
                                        // TODO: Thêm chức năng mua ngay
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Color(0xFFEC7063),
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(5),
                                        ),
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 10, vertical: 5),
                                      ),
                                      child: Text(
                                        'Mua ngay',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
