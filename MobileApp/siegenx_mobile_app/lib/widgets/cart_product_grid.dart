// cart_product_grid.dart
import 'package:another_flushbar/flushbar.dart';
import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/cart_controller.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/delete_confirmation_dialog.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/utils/dialog_utils.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';

class CartProductGrid extends StatefulWidget {
  final List<Product> cartProducts;
  final VoidCallback onCartUpdated;

  const CartProductGrid({
    Key? key,
    required this.cartProducts,
    required this.onCartUpdated,
  }) : super(key: key);

  @override
  _CartProductGridState createState() => _CartProductGridState();
}

class _CartProductGridState extends State<CartProductGrid> {
  int calculateDiscountPercentage(double price, double newPrice) {
    return (((price - newPrice) / price) * 100).round();
  }

  Future<void> _removeProduct(
      BuildContext context, Product product, int index) async {
    try {
      await CartController.removeProductFromCart(
          context, product.id, product.quantity);
      setState(() {
        widget.cartProducts.removeAt(index);
      });
      widget.onCartUpdated();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi xóa sản phẩm: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0.0),
      child: ListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: widget.cartProducts.length,
        itemBuilder: (context, index) {
          final product = widget.cartProducts[index];
          return Column(
            children: [
              Dismissible(
                key: Key(product.id.toString()),
                direction: DismissDirection.endToStart,
                background: Container(
                  color: Colors.red,
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 20),
                  child: const Icon(Icons.delete, color: Colors.white),
                ),
                onDismissed: (direction) =>
                    _removeProduct(context, product, index),
                confirmDismiss: (direction) async {
                  return await DeleteConfirmationDialog.showConfirmDeleteDialog(
                    context,
                    productName: product.nameProduct,
                    quantity: product.quantity,
                  );
                },
                child: GestureDetector(
                  onLongPress: () => showProductDialog(context, product),
                  child: Container(
                    margin: const EdgeInsets.only(top: 12),
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            '${ApiService.imageBaseUrl}${product.images[0]}',
                            width: 90,
                            height: 90,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(Icons.error),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product.nameProduct,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 2),
                              Text(
                                product.newPrice != null
                                    ? formatCurrency(product.newPrice!)
                                    : formatCurrency(product.price),
                                style: const TextStyle(
                                  fontSize: 15,
                                  color: Color(0xFF00B98E),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
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
                                  // phần tuỳ chỉnh số lượng
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 0, vertical: 0),
                                    decoration: BoxDecoration(
                                      border: Border.all(color: Colors.grey),
                                      borderRadius: BorderRadius.circular(5),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        GestureDetector(
                                          onTap: () =>
                                              _decreaseQuantity(product),
                                          child: Padding(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8),
                                            child: Icon(
                                              Icons.remove,
                                              size: 20,
                                              color: product.quantity > 1
                                                  ? Colors.black
                                                  : Colors.grey,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          width: 20,
                                          alignment: Alignment.center,
                                          child: Text(
                                            product.quantity.toString(),
                                            style:
                                                const TextStyle(fontSize: 16),
                                          ),
                                        ),
                                        GestureDetector(
                                          onTap: () =>
                                              _increaseQuantity(product),
                                          child: const Padding(
                                            padding: EdgeInsets.symmetric(
                                                horizontal: 8),
                                            child: Icon(
                                              Icons.add,
                                              size: 20,
                                              color: Colors.black,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              if (index < widget.cartProducts.length - 1)
                Divider(
                  color: Colors.grey.withOpacity(0.3),
                  height: 1,
                  thickness: 1,
                ),
            ],
          );
        },
      ),
    );
  }

  Future<void> _decreaseQuantity(Product product) async {
    if (product.quantity > 1) {
      try {
        await CartController.removeOneProductFromCart(context, product.id);
        setState(() => product.quantity--);
        widget.onCartUpdated();
      } catch (e) {
        _showErrorFlushbar('Lỗi khi giảm số lượng: $e');
      }
    } else {
      _showInfoFlushbar('Mua thêm sản phẩm mới có thể đặt đơn');
    }
  }

  Future<void> _increaseQuantity(Product product) async {
    try {
      await CartController.addProductToCart(context, product.id);
      setState(() => product.quantity++);
      widget.onCartUpdated();
    } catch (e) {
      _showErrorFlushbar('Lỗi khi tăng số lượng: $e');
    }
  }

  void _showErrorFlushbar(String message) {
    Flushbar(
      messageText: Text(
        message,
        textAlign: TextAlign.center,
        style: const TextStyle(color: Colors.white),
      ),
      duration: const Duration(seconds: 2),
      flushbarPosition: FlushbarPosition.TOP,
      backgroundColor: Colors.redAccent,
      margin: const EdgeInsets.fromLTRB(5, 5, 5, 0),
      borderRadius: BorderRadius.circular(10),
    )..show(context);
  }

  void _showInfoFlushbar(String message) {
    Flushbar(
      messageText: Text(
        message,
        textAlign: TextAlign.center,
        style: const TextStyle(fontSize: 16, color: Colors.white),
      ),
      duration: const Duration(seconds: 2),
      flushbarPosition: FlushbarPosition.TOP,
      backgroundColor: Colors.grey,
      margin: const EdgeInsets.fromLTRB(20, 5, 20, 0),
      borderRadius: BorderRadius.circular(10),
    )..show(context);
  }
}
