import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/controllers/favorites_manager.dart';

class FavoritesProvider extends ChangeNotifier {
  Map<String, List<int>> _favorites = {};

  FavoritesProvider() {
    // Tải dữ liệu yêu thích mặc định cho user "guest" khi khởi tạo
    loadFavorites("guest");
  }

  List<int> getFavorites(String userId) {
    return _favorites[userId] ?? [];
  }

  Future<void> loadFavorites(String userId) async {
    final favorites = await FavoritesManager.getFavorites(userId);
    _favorites[userId] = favorites;
    notifyListeners();
  }

  Future<void> addFavorite(String userId, int productId) async {
    final favorites = _favorites[userId] ?? [];
    if (!favorites.contains(productId)) {
      favorites.add(productId);
      _favorites[userId] = favorites;
      await FavoritesManager.addFavorite(userId, productId);
      notifyListeners();
    }
  }

  Future<void> removeFavorite(String userId, int productId) async {
    final favorites = _favorites[userId] ?? [];
    favorites.remove(productId);
    _favorites[userId] = favorites;
    await FavoritesManager.removeFavorite(userId, productId);
    notifyListeners();
  }
}
