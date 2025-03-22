import 'package:shared_preferences/shared_preferences.dart';

class FavoritesManager {
  static Future<void> addFavorite(String userId, String productId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    if (!favorites.contains(productId)) {
      favorites.add(productId); // Lưu dưới dạng String
      await prefs.setStringList(key, favorites);
      print('Added favorite: $productId for user $userId');
    }
  }

  static Future<void> removeFavorite(String userId, String productId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    if (favorites.contains(productId)) {
      favorites.remove(productId); // Xóa dưới dạng String
      await prefs.setStringList(key, favorites);
      print('Removed favorite: $productId for user $userId');
    }
  }

  static Future<List<String>> getFavorites(String userId) async {
    // Trả về List<String>
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    print('Loaded favorites for user $userId: $favorites');
    return favorites; // Trả về danh sách String
  }
}
