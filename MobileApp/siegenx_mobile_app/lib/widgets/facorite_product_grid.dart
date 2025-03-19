import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/controllers/favorite_icon.dart';
import 'package:siegenx_mobile_app/controllers/product_service.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/utils/dialog_utils.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/providers/favorites_provider.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/widgets/add_to_cart_bottom_sheet.dart'; // Thêm import này để dùng AppColors

class FavoriteProductGrid extends StatefulWidget {
  const FavoriteProductGrid({Key? key}) : super(key: key);

  @override
  _FavoriteProductGridState createState() => _FavoriteProductGridState();
}

class _FavoriteProductGridState extends State<FavoriteProductGrid> {
  @override
  void initState() {
    super.initState();
    // Tải danh sách yêu thích khi khởi động
    final userId =
        Provider.of<AuthProvider>(context, listen: false).userId ?? "guest";
    Provider.of<FavoritesProvider>(context, listen: false)
        .loadFavorites(userId);
  }

  // Hàm tính phần trăm giảm giá (tái sử dụng từ CartProductGrid)
  int calculateDiscountPercentage(double price, double newPrice) {
    return (((price - newPrice) / price) * 100).round();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final favoritesProvider = Provider.of<FavoritesProvider>(context);
    final favoriteProductIds =
        favoritesProvider.getFavorites(authProvider.userId ?? "guest");

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

              return GestureDetector(
                // onLongPress: () {
                //   showProductDialog(context, product);
                // },
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
                          '${ApiService.imageBaseUrl}${product.images[0]}',
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
                                    product.nameProduct,
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
                                FavoriteIcon(productId: product.id),
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
                                Row(
                                  children: [
                                    if (product.newPrice != null)
                                      Text(
                                        formatCurrency(product.price),
                                        style: const TextStyle(
                                          fontSize: 13,
                                          color: Colors.grey,
                                          decoration:
                                              TextDecoration.lineThrough,
                                        ),
                                      ),
                                    const SizedBox(width: 12),
                                    if (product.newPrice != null)
                                      Text(
                                        '-${calculateDiscountPercentage(
                                          product.price,
                                          product.newPrice!,
                                        )}%',
                                        style: const TextStyle(
                                          fontSize: 13,
                                          color: AppColors.textColorRed,
                                        ),
                                      ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    ElevatedButton(
                                      onPressed: () {
                                        showModalBottomSheet(
                                          context: context,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.vertical(
                                                top: Radius.circular(15)),
                                          ),
                                          builder: (context) =>
                                              AddToCartBottomSheet(
                                                  product: product),
                                        );
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.primaryColor,
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(5),
                                        ),
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 10, vertical: 5),
                                      ),
                                      child: Text(
                                        'Thêm vào giỏ hàng',
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
