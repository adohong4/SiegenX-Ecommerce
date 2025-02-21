import 'package:flutter/material.dart';

class BannerWidget extends StatelessWidget {
  final List<String> bannerImages = [
    'assets/banner1.jpg',
    'assets/banner2.jpg',
    'assets/banner3.jpg',
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 150, // Chiều cao banner
      child: PageView.builder(
        itemCount: bannerImages.length,
        scrollDirection: Axis.horizontal,
        itemBuilder: (context, index) {
          return Padding(
            padding: EdgeInsets.symmetric(horizontal: 10.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(15), // Bo góc banner
              child: Image.asset(
                bannerImages[index],
                fit: BoxFit.cover, // Hiển thị ảnh đầy đủ
                width: double.infinity,
              ),
            ),
          );
        },
      ),
    );
  }
}
