import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:siegenx_mobile_app/providers/auth_provider.dart';
import 'package:siegenx_mobile_app/providers/favorites_provider.dart';

class FavoriteIcon extends StatelessWidget {
  final int productId;

  const FavoriteIcon({Key? key, required this.productId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final userId = authProvider.userId ?? "guest";
    final favoritesProvider = Provider.of<FavoritesProvider>(context);
    final isFavorite =
        favoritesProvider.getFavorites(userId).contains(productId);

    return GestureDetector(
      onTap: () async {
        if (isFavorite) {
          await favoritesProvider.removeFavorite(userId, productId);
        } else {
          await favoritesProvider.addFavorite(userId, productId);
        }
      },
      child: Icon(
        isFavorite ? Icons.favorite : Icons.favorite_border,
        color: isFavorite ? Colors.red : Colors.grey[400],
        size: 20,
      ),
    );
  }
}
