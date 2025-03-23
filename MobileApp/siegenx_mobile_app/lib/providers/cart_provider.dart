// import 'package:flutter/material.dart';
// import 'package:siegenx_mobile_app/models/product.dart';

// class CartProvider with ChangeNotifier {
//   List<Product> _cartProducts = [];

//   int get cartItemCount => _cartProducts.length; // Số lượng sản phẩm
//   List<Product> get cartProducts => _cartProducts;

//   void setCartProducts(List<Product> products) {
//     _cartProducts = products;
//     notifyListeners(); // Thông báo cho các widget lắng nghe khi dữ liệu thay đổi
//   }

//   void addProduct(Product product) {
//     _cartProducts.add(product);
//     notifyListeners(); // Cập nhật ngay khi thêm sản phẩm
//   }

//   void removeProduct(int productId) {
//     _cartProducts.removeWhere((product) => product.id == productId);
//     notifyListeners(); // Cập nhật ngay khi xóa sản phẩm
//   }
// }
