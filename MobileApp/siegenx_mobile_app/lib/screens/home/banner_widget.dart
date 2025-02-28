import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';

class BannerWidget extends StatefulWidget {
  const BannerWidget({Key? key}) : super(key: key);

  @override
  _BannerWidgetState createState() => _BannerWidgetState();
}

class _BannerWidgetState extends State<BannerWidget> {
  final List<String> bannerImages = [
    "assets/banners/banner1.jpg",
    "assets/banners/banner2.jpg",
    "assets/banners/banner3.jpg",
    "assets/banners/banner4.png",
  ];

  int _currentIndex = 0;
  final PageController _pageController = PageController();
  Timer? _timer;
  bool _isUserInteracting = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startAutoSlide();
    });
  }

  void _startAutoSlide() {
    _timer?.cancel();
    _timer = Timer.periodic(Duration(seconds: 3), (timer) {
      if (!_isUserInteracting) {
        if (_currentIndex < bannerImages.length - 1) {
          _currentIndex++;
        } else {
          _currentIndex = 0;
        }

        if (_pageController.hasClients) {
          // Kiểm tra trước khi gọi animateToPage
          _pageController.animateToPage(
            _currentIndex,
            duration: Duration(milliseconds: 500),
            curve: Curves.easeInOut,
          );

          setState(() {}); // Cập nhật UI
        }
      }
    });
  }

  void _onUserInteraction() {
    _isUserInteracting = true;
    _timer?.cancel();

    Future.delayed(Duration(seconds: 3), () {
      _isUserInteracting = false;
      _startAutoSlide();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    if (_pageController.hasClients) {
      _pageController.dispose();
    }
    super.dispose();
  }

  Widget _buildImage(String imagePath) {
    if (imagePath.startsWith('http')) {
      return Image.network(
        imagePath,
        fit: BoxFit.cover,
        width: double.infinity,
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Center(child: CircularProgressIndicator());
        },
        errorBuilder: (context, error, stackTrace) {
          return Center(child: Text("Image not available"));
        },
      );
    } else if (imagePath.startsWith('assets/')) {
      return Image.asset(
        imagePath,
        fit: BoxFit.cover,
        width: double.infinity,
        errorBuilder: (context, error, stackTrace) {
          return Center(child: Text("Asset not found"));
        },
      );
    } else {
      return Image.file(
        File(imagePath),
        fit: BoxFit.cover,
        width: double.infinity,
        errorBuilder: (context, error, stackTrace) {
          return Center(child: Text("File not found"));
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 150,
          child: GestureDetector(
            onPanDown: (_) => _onUserInteraction(), // Dừng auto slide khi vuốt
            child: PageView.builder(
              controller: _pageController,
              itemCount: bannerImages.length,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                });
                _onUserInteraction(); // Reset timer khi người dùng trượt banner
              },
              itemBuilder: (context, index) {
                return Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10.0),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(15),
                    child: _buildImage(bannerImages[index]),
                  ),
                );
              },
            ),
          ),
        ),

        // Indicator (Đốm tròn bên dưới)
        SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(bannerImages.length, (index) {
            return Container(
              margin: EdgeInsets.symmetric(horizontal: 4),
              width: _currentIndex == index ? 12 : 8,
              height: _currentIndex == index ? 12 : 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _currentIndex == index ? Color(0xFF00B98E) : Colors.grey,
              ),
            );
          }),
        ),
      ],
    );
  }
}
