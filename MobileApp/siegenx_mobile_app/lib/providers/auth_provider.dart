import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  String? _userId;
  String? _token;
  String? _email;

  String? get userId => _userId;
  String? get token => _token;
  String? get email => _email;

  void setAuthData(String userId, String token, {String? email}) {
    _userId = userId;
    _token = token;
    _email = email;
    print('Token set in AuthProvider: $_token'); // Debug token
    notifyListeners();
  }

  void clearAuthData() {
    _userId = null;
    _token = null;
    _email = null;
    print('Token cleared in AuthProvider'); // Debug token
    notifyListeners();
  }
}
