import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/cart_controller.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/utils/dialog_utils.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';

class CartProductGrid extends StatefulWidget {
  final bool selectAll;
  final Function(bool) onSelectionChange;

  const CartProductGrid({
    Key? key,
    required this.selectAll,
    required this.onSelectionChange,
  }) : super(key: key);

  @override
  _CartProductGridState createState() => _CartProductGridState();
}

class _CartProductGridState extends State<CartProductGrid> {
  final Map<int, bool> _selectedProducts = {};

  int calculateDiscountPercentage(double price, double newPrice) {
    return (((price - newPrice) / price) * 100).round();
  }

  @override
  void didUpdateWidget(covariant CartProductGrid oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selectAll != oldWidget.selectAll) {
      setState(() {
        _selectedProducts.updateAll((key, value) => widget.selectAll);
      });
    }
  }

  Future<void> _removeProduct(
      BuildContext context, Product product, int index) async {
    try {
      await CartController.removeProductFromCart(
          context, product.id, product.quantity);
      setState(() {
        _selectedProducts.remove(index);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('${product.nameProduct} đã được xóa khỏi giỏ hàng')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi xóa sản phẩm: $e')),
      );
    }
  }

  Future<void> _decreaseQuantity(Product product, int index) async {
    if (product.quantity > 1) {
      try {
        await CartController.removeOneProductFromCart(context, product.id);
        setState(() {
          product.quantity--;
        });
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi giảm số lượng: $e')),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Mua thêm sản phẩm mới có thể đặt đơn')),
      );
    }
  }

  Future<void> _increaseQuantity(Product product) async {
    try {
      await CartController.addProductToCart(context, product.id);
      setState(() {
        product.quantity++;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi tăng số lượng: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 0.0),
      child: FutureBuilder<List<Product>>(
        future: CartController.fetchCartProducts(context),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No products in cart'));
          }

          final cartProducts = snapshot.data!;

          if (cartProducts.isEmpty) {
            return Center(child: Text('No products in cart'));
          }

          for (int i = 0; i < cartProducts.length; i++) {
            _selectedProducts.putIfAbsent(i, () => widget.selectAll);
          }

          return ListView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: cartProducts.length,
            itemBuilder: (context, index) {
              final product = cartProducts[index];

              return Column(
                children: [
                  Dismissible(
                    key: Key(product.id.toString()),
                    direction: DismissDirection.endToStart,
                    background: Container(
                      color: Colors.red,
                      alignment: Alignment.centerRight,
                      padding: EdgeInsets.only(right: 20),
                      child: Icon(
                        Icons.delete,
                        color: Colors.white,
                      ),
                    ),
                    onDismissed: (direction) {
                      _removeProduct(context, product, index);
                      cartProducts.removeAt(index);
                    },
                    confirmDismiss: (direction) async {
                      return await showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: Text('Xác nhận'),
                            content: Text(
                                'Bạn có chắc muốn xóa ${product.nameProduct} (số lượng: ${product.quantity}) khỏi giỏ hàng?'),
                            actions: [
                              TextButton(
                                onPressed: () =>
                                    Navigator.of(context).pop(false),
                                child: Text('Hủy'),
                              ),
                              TextButton(
                                onPressed: () =>
                                    Navigator.of(context).pop(true),
                                child: Text('Xóa'),
                              ),
                            ],
                          );
                        },
                      );
                    },
                    child: GestureDetector(
                      onLongPress: () {
                        showProductDialog(context, product);
                      },
                      child: Container(
                        margin: EdgeInsets.only(top: 12),
                        padding: EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 24,
                              height: 24,
                              child: Checkbox(
                                shape: CircleBorder(),
                                value: _selectedProducts[index],
                                activeColor: Colors.green,
                                onChanged: (bool? value) {
                                  setState(() {
                                    _selectedProducts[index] = value ?? false;
                                    bool allSelected = _selectedProducts.values
                                        .every((isSelected) => isSelected);
                                    widget.onSelectionChange(allSelected);
                                  });
                                },
                              ),
                            ),
                            SizedBox(width: 8),
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
                            SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    product.nameProduct,
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                      color: Colors.black,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  SizedBox(height: 2),
                                  Text(
                                    product.newPrice != null
                                        ? formatCurrency(product.newPrice!)
                                        : formatCurrency(product.price),
                                    style: TextStyle(
                                      fontSize: 15,
                                      color: Color(0xFF00B98E),
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Padding(
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 0.0),
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.start,
                                          children: [
                                            if (product.newPrice != null)
                                              Text(
                                                formatCurrency(product.price),
                                                style: TextStyle(
                                                  fontSize: 13,
                                                  color: Colors.grey,
                                                  decoration: TextDecoration
                                                      .lineThrough,
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
                                      Container(
                                        padding: EdgeInsets.symmetric(
                                            horizontal: 12, vertical: 8),
                                        decoration: BoxDecoration(
                                          color: Colors.grey[200],
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            GestureDetector(
                                              onTap: () => _decreaseQuantity(
                                                  product, index),
                                              child: Padding(
                                                padding: EdgeInsets.symmetric(
                                                    horizontal: 8),
                                                child: Text('-',
                                                    style: TextStyle(
                                                        fontSize: 18,
                                                        fontWeight:
                                                            FontWeight.bold)),
                                              ),
                                            ),
                                            Padding(
                                              padding: EdgeInsets.symmetric(
                                                  horizontal: 10),
                                              child: Text(
                                                product.quantity.toString(),
                                                style: TextStyle(
                                                    fontSize: 14,
                                                    fontWeight:
                                                        FontWeight.w500),
                                              ),
                                            ),
                                            GestureDetector(
                                              onTap: () =>
                                                  _increaseQuantity(product),
                                              child: Padding(
                                                padding: EdgeInsets.symmetric(
                                                    horizontal: 8),
                                                child: Text('+',
                                                    style: TextStyle(
                                                        fontSize: 15,
                                                        fontWeight:
                                                            FontWeight.bold)),
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
                  if (index < cartProducts.length - 1)
                    Divider(
                      color: Colors.grey.withOpacity(0.3),
                      height: 1,
                      thickness: 1,
                    ),
                ],
              );
            },
          );
        },
      ),
    );
  }
}
