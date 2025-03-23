import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/favorite_icon.dart';
import 'package:siegenx_mobile_app/controllers/product_service.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/widgets/add_to_cart_bottom_sheet.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';

class ProductGrid extends StatelessWidget {
  ProductGrid({Key? key}) : super(key: key);

  int calculateDiscountPercentage(double price, double newPrice) {
    return (((price - newPrice) / price) * 100).round();
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
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('Không tìm thấy sản phẩm'));
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

                  return GestureDetector(
                    onTap: () {
                      ProductService.fetchProductAndNavigate(
                          context, product.productSlug!);
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
                                      '${ApiService.imageBaseUrl}${product.images.isNotEmpty ? product.images[0] : ''}',
                                      width: double.infinity,
                                      height: 160,
                                      fit: BoxFit.cover,
                                      errorBuilder:
                                          (context, error, stackTrace) => Icon(
                                        Icons.image,
                                        color: Colors.grey,
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
                                      size: 22,
                                    ),
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
                                  product.newPrice != null
                                      ? formatCurrency(product.newPrice!)
                                      : formatCurrency(product.price),
                                  style: TextStyle(
                                    fontSize: 15,
                                    color: Color(0xFF00B98E),
                                  ),
                                ),
                                FavoriteIcon(productId: product.id),
                              ],
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                if (product.newPrice != null)
                                  Text(
                                    formatCurrency(product.price),
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: Colors.grey,
                                      decoration: TextDecoration.lineThrough,
                                    ),
                                  ),
                                const SizedBox(width: 12),
                                if (product.newPrice != null)
                                  Text(
                                    '-${calculateDiscountPercentage(product.price, product.newPrice!)}%',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: AppColors.textColorRed,
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
                                product.nameProduct,
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
