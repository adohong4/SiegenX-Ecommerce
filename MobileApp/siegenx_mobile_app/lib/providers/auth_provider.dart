import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  String? _userId;
  String? _token;
  String? _email; // Thêm email

  String? get userId => _userId;
  String? get token => _token;
  String? get email => _email; // Getter cho email

  void setAuthData(String userId, String token, {String? email}) {
    _userId = userId;
    _token = token;
    _email = email; // Lưu email
    notifyListeners();
  }

  void clearAuthData() {
    _userId = null;
    _token = null;
    _email = null;
    notifyListeners();
  }
}
