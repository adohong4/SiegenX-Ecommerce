// cart_screen.dart
import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/cart_controller.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/screens/payment_screen.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:siegenx_mobile_app/widgets/cart_product_grid.dart';

class CartScreen extends StatefulWidget {
  final Function(int)?
      onCartCountUpdated; // Callback để truyền tổng số sản phẩm

  const CartScreen({super.key, this.onCartCountUpdated});

  @override
  _CartScreenState createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  List<Product> _cartProducts = [];
  bool _isLoading = true;
  Map<int, bool> _selectedProducts = {};
  bool _selectAll = false;

  @override
  void initState() {
    super.initState();
    _fetchCartProducts();
  }

  void _onCartUpdated() {
    setState(() {
      // Cập nhật tổng số sản phẩm và gọi callback
      widget.onCartCountUpdated?.call(_cartProducts.length);
    });
  }

  Future<void> _fetchCartProducts() async {
    try {
      final products = await CartController.fetchCartProducts(context);
      setState(() {
        _cartProducts = products;
        _isLoading = false;
        _selectedProducts = Map.fromIterables(
          List.generate(products.length, (index) => index),
          List.filled(products.length, _selectAll),
        );
        widget.onCartCountUpdated
            ?.call(_cartProducts.length); // Gọi callback khi fetch xong
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

  void _toggleSelectAll(bool? value) {
    final newValue = value ?? false;
    // Sử dụng postFrameCallback để tránh setState trong build phase
    WidgetsBinding.instance.addPostFrameCallback((_) {
      setState(() {
        _selectAll = newValue;
        _selectedProducts = Map.fromIterables(
          List.generate(_cartProducts.length, (index) => index),
          List.filled(_cartProducts.length, newValue),
        );
      });
    });
  }

  void _onProductSelected(int index, bool isSelected) {
    setState(() {
      _selectedProducts[index] = isSelected;
      _selectAll = _selectedProducts.values.every((val) => val);
    });
  }

  double _calculateTotalSelectedPrice() {
    double total = 0;
    _selectedProducts.forEach((index, isSelected) {
      if (isSelected && index < _cartProducts.length) {
        final product = _cartProducts[index];
        final price = product.newPrice ?? product.price;
        total += price * product.quantity;
      }
    });
    return total;
  }

  double _calculateTotalDiscount() {
    double discount = 0;
    _selectedProducts.forEach((index, isSelected) {
      if (isSelected && index < _cartProducts.length) {
        final product = _cartProducts[index];
        if (product.newPrice != null) {
          discount += (product.price - product.newPrice!) * product.quantity;
        }
      }
    });
    return discount;
  }

  int get _selectedCount => _selectedProducts.values.where((v) => v).length;

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
                        selectedProducts: _selectedProducts,
                        onProductSelected: _onProductSelected,
                        selectAll: _selectAll,
                        onSelectAll: _toggleSelectAll,
                        onCartUpdated: _onCartUpdated, // Truyền callback
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
                  Row(
                    children: [
                      SizedBox(
                        width: 24,
                        height: 24,
                        child: Checkbox(
                          shape: const CircleBorder(),
                          value: _selectAll,
                          activeColor: Colors.green,
                          onChanged: _toggleSelectAll,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text("Tất cả"),
                    ],
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            formatCurrency(_calculateTotalSelectedPrice()),
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
                      const SizedBox(width: 10),
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
                          onPressed: _selectedCount > 0
                              ? () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => PaymentScreen(
                                        totalPrice:
                                            _calculateTotalSelectedPrice(),
                                        selectedCount: _selectedCount,
                                      ),
                                    ),
                                  );
                                }
                              : null,
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
                                "($_selectedCount)",
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
                ],
              ),
            ),
    );
  }
}
