import 'package:shared_preferences/shared_preferences.dart';

class FavoritesManager {
  // Thêm sản phẩm vào danh sách yêu thích
  static Future<void> addFavorite(String userId, int productId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    if (!favorites.contains(productId.toString())) {
      favorites.add(productId.toString());
      await prefs.setStringList(key, favorites);
    }
  }

  // Xóa sản phẩm khỏi danh sách yêu thích
  static Future<void> removeFavorite(String userId, int productId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    favorites.remove(productId.toString());
    await prefs.setStringList(key, favorites);
  }

  // Lấy danh sách ID sản phẩm yêu thích của người dùng
  static Future<List<int>> getFavorites(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    return favorites.map((id) => int.parse(id)).toList();
  }
}
