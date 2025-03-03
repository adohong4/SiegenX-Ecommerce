import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/controllers/favorites_manager.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/services/product_service.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/utils/dialog_utils.dart';
import 'package:siegenx_mobile_app/widgets/product_detail.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';

class ProductGrid extends StatefulWidget {
  const ProductGrid({Key? key}) : super(key: key);

  @override
  _ProductGridState createState() => _ProductGridState();
}

class _ProductGridState extends State<ProductGrid> {
  List<int> favoriteProductIds = [];

  @override
  void initState() {
    super.initState();
    _loadFavorites();
  }

  // Tải danh sách ID sản phẩm yêu thích từ shared_preferences
  Future<void> _loadFavorites() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId =
        authProvider.userId ?? "guest"; // Dùng "guest" nếu chưa đăng nhập
    final favorites = await FavoritesManager.getFavorites(userId);
    setState(() {
      favoriteProductIds = favorites;
    });
  }

  // Xử lý khi người dùng nhấn vào icon yêu thích
  Future<void> _toggleFavorite(int productId) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId ?? "guest";
    if (favoriteProductIds.contains(productId)) {
      await FavoritesManager.removeFavorite(userId, productId);
    } else {
      await FavoritesManager.addFavorite(userId, productId);
    }
    await _loadFavorites(); // Cập nhật danh sách yêu thích
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
            return Center(child: Text('No products found'));
          }

          final products = snapshot.data!;
          return LayoutBuilder(
            builder: (context, constraints) {
              int crossAxisCount = (constraints.maxWidth ~/ 150).clamp(2, 4);

              return GridView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: crossAxisCount,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 0.65,
                ),
                itemCount: products.length,
                itemBuilder: (context, index) {
                  final product = products[index];
                  final isFavorite = favoriteProductIds.contains(product.id);

                  return GestureDetector(
                    onLongPress: () {
                      showProductDialog(context, product);
                    },
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              ProductDetailScreen(product: product),
                        ),
                      );
                    },
                    child: IntrinsicHeight(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Stack(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                  color: Color(0xFFF2F3F4),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Padding(
                                  padding: EdgeInsets.all(5),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Image.network(
                                      '${ApiService.imageBaseUrl}${product.imageUrl[0]}',
                                      width: double.infinity,
                                      height: 160,
                                      fit: BoxFit.cover,
                                      errorBuilder:
                                          (context, error, stackTrace) => Icon(
                                        Icons.error,
                                        color: Colors.red,
                                        size: 120,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              Positioned(
                                top: 8,
                                right: 8,
                                child: Container(
                                  width: 30,
                                  height: 30,
                                  decoration: BoxDecoration(
                                    color: Color(0xFFF2F3F4),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: IconButton(
                                    padding: EdgeInsets.zero,
                                    icon: Icon(
                                      Icons.add_shopping_cart_rounded,
                                      color: Colors.black,
                                      size: 18,
                                    ),
                                    onPressed: () {
                                      // TODO: Thêm chức năng thêm vào giỏ hàng
                                    },
                                  ),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 5),
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  formatCurrency(product.price),
                                  style: TextStyle(
                                    fontSize: 15,
                                    color: Color(0xFF00B98E),
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () async {
                                    await _toggleFavorite(product.id);
                                  },
                                  child: Icon(
                                    isFavorite
                                        ? Icons.favorite
                                        : Icons.favorite_border,
                                    color: isFavorite
                                        ? Color(0xFF00B98E)
                                        : Colors.grey[400],
                                    size: 20,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                Text(
                                  'Số lượng: ${product.quantity}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Flexible(
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 8.0),
                              child: Text(
                                product.name,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                textAlign: TextAlign.start,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
