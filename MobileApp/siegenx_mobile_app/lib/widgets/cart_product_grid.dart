import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/services/product_service.dart';
import 'package:siegenx_mobile_app/models/product.dart';
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

  @override
  void didUpdateWidget(covariant CartProductGrid oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selectAll != oldWidget.selectAll) {
      setState(() {
        _selectedProducts.updateAll((key, value) => widget.selectAll);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 0.0),
      child: FutureBuilder<List<Product>>(
        future: ProductService.fetchAllProducts(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No products in cart'));
          }

          final cartProducts =
              snapshot.data!.where((product) => product.quantity > 0).toList();

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
                  GestureDetector(
                    onLongPress: () {
                      showProductDialog(context, product);
                    },
                    child: Container(
                      margin: EdgeInsets.only(bottom: 12),
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
                              '${ApiService.imageBaseUrl}${product.imageUrl[0]}',
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
                                  product.name,
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
                                  formatCurrency(product.price),
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
                                    Text(
                                      'Số lượng: ${product.quantity}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.black54,
                                      ),
                                    ),
                                    Container(
                                      padding: EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 8),
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          GestureDetector(
                                            onTap: () {
                                              // setState(() {
                                              //   if (product.quantity > 1) {
                                              //     product.quantity--;
                                              //   }
                                              // });
                                            },
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
                                                  fontWeight: FontWeight.w500),
                                            ),
                                          ),
                                          GestureDetector(
                                            onTap: () {
                                              // setState(() {
                                              //   product.quantity++;
                                              // });
                                            },
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
