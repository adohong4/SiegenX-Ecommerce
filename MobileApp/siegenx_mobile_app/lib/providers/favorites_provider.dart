import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/favorites_manager.dart';

class FavoritesProvider extends ChangeNotifier {
  Map<String, List<String>> _favorites = {}; // Thay int thành String

  FavoritesProvider() {
    // Tải dữ liệu yêu thích mặc định cho user "guest" khi khởi tạo
    loadFavorites("guest");
  }

  List<String> getFavorites(String userId) {
    // Thay int thành String
    return _favorites[userId] ?? [];
  }

  Future<void> loadFavorites(String userId) async {
    final favorites = await FavoritesManager.getFavorites(userId);
    _favorites[userId] = favorites; // favorites giờ là List<String>
    notifyListeners();
  }

  Future<void> addFavorite(String userId, String productId) async {
    final favorites = _favorites[userId] ?? [];
    if (!favorites.contains(productId)) {
      // Giữ String, không cần parse
      favorites.add(productId);
      _favorites[userId] = favorites;
      await FavoritesManager.addFavorite(userId, productId); // Đã là String
      notifyListeners();
    }
  }

  Future<void> removeFavorite(String userId, String productId) async {
    final favorites = _favorites[userId] ?? [];
    if (favorites.contains(productId)) {
      // Giữ String, không cần parse
      favorites.remove(productId);
      _favorites[userId] = favorites;
      await FavoritesManager.removeFavorite(userId, productId); // Đã là String
      notifyListeners();
    }
  }
}
