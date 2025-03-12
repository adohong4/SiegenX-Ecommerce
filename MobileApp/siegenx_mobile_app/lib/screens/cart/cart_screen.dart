import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/cart_controller.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/screens/payment_screen.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/widgets/cart_product_grid.dart';

class CartScreen extends StatefulWidget {
  final Function(int)? onCartCountUpdated;

  const CartScreen({super.key, this.onCartCountUpdated});

  @override
  _CartScreenState createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  List<Product> _cartProducts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCartProducts();
  }

  void _onCartUpdated() {
    setState(() {
      widget.onCartCountUpdated?.call(_cartProducts.length);
    });
  }

  Future<void> _fetchCartProducts() async {
    try {
      final products = await CartController.fetchCartProducts(context);
      setState(() {
        _cartProducts = products;
        _isLoading = false;
        widget.onCartCountUpdated?.call(_cartProducts.length);
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading cart: $e')),
      );
    }
  }

  double _calculateTotalPrice() {
    double total = 0;
    for (var product in _cartProducts) {
      final price = product.newPrice ?? product.price;
      total += price * product.quantity;
    }
    return total;
  }

  double _calculateTotalDiscount() {
    double discount = 0;
    for (var product in _cartProducts) {
      if (product.newPrice != null) {
        discount += (product.price - product.newPrice!) * product.quantity;
      }
    }
    return discount;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _cartProducts.isEmpty
              ? const Center(child: Text('No products in cart'))
              : SingleChildScrollView(
                  child: Column(
                    children: [
                      CartProductGrid(
                        cartProducts: _cartProducts,
                        onCartUpdated: _onCartUpdated,
                      ),
                    ],
                  ),
                ),
      bottomNavigationBar: _isLoading || _cartProducts.isEmpty
          ? null
          : Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Colors.grey, width: 0.5)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        formatCurrency(_calculateTotalPrice()),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textColorRed,
                        ),
                      ),
                      const Text("Phí vận chuyển: 50.000 đ"),
                      Text(
                        "Giảm: ${formatCurrency(_calculateTotalDiscount())}",
                        style: TextStyle(color: AppColors.textColorRed),
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => PaymentScreen(
                              totalPrice: _calculateTotalPrice(),
                              selectedCount: _cartProducts.length,
                              selectedProducts: _cartProducts,
                            ),
                          ),
                        );
                      },
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Text(
                            "Thanh toán",
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.white,
                            ),
                          ),
                          Text(
                            "(${_cartProducts.length})",
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
