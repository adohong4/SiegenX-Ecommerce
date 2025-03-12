import 'package:flutter/material.dart';

class CartIconProvider with ChangeNotifier {
  Offset _cartIconPosition = Offset.zero;

  Offset get cartIconPosition => _cartIconPosition;

  void setCartIconPosition(Offset position) {
    _cartIconPosition = position;
    notifyListeners();
  }
}
