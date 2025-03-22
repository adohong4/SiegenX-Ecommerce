// lib/utils/number_cart_product.dart
import 'package:siegenx_mobile_app/models/product.dart';

int calculateCartItemCount(List<Product> cartProducts) {
  return cartProducts.length; // Đếm tổng số sản phẩm trong giỏ hàng
}
