import 'package:shared_preferences/shared_preferences.dart';

class FavoritesManager {
  static Future<void> addFavorite(String userId, int productId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    if (!favorites.contains(productId.toString())) {
      favorites.add(productId.toString());
      await prefs.setStringList(key, favorites);
      print('Added favorite: $productId for user $userId');
    }
  }

  static Future<void> removeFavorite(String userId, int productId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    favorites.remove(productId.toString());
    await prefs.setStringList(key, favorites);
    print('Removed favorite: $productId for user $userId');
  }

  static Future<List<int>> getFavorites(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'favorites_$userId';
    List<String> favorites = prefs.getStringList(key) ?? [];
    print('Loaded favorites for user $userId: $favorites');
    return favorites.map((id) => int.parse(id)).toList();
  }
}
