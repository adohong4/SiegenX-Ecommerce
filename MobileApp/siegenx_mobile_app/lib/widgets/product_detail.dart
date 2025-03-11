import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';

class ProductDetailScreen extends StatelessWidget {
  final Product product;

  const ProductDetailScreen({Key? key, required this.product})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(product.nameProduct,
            maxLines: 1, overflow: TextOverflow.ellipsis),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Image.network(
                '${ApiService.imageBaseUrl}${product.images[0]}',
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Icon(
                  Icons.error,
                  color: Colors.red,
                  size: 120,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              product.nameProduct,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              "Price: ${formatCurrency(product.price)}",
              style: const TextStyle(fontSize: 18, color: Colors.green),
            ),
            const SizedBox(height: 8),
            Text(
              "Quantity: ${product.quantity}",
              style: const TextStyle(fontSize: 16, color: Colors.black54),
            ),
            const SizedBox(height: 16),
            Text(
              product.description,
              style: const TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
