import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';
import 'package:another_flushbar/flushbar.dart'; // Thêm import này để dùng Flushbar

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({Key? key, required this.product})
      : super(key: key);

  @override
  _ProductDetailScreenState createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  late PageController _pageController;
  int selectedImageIndex = 0;
  String selectedTab = 'description';

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _showFullScreenImage(BuildContext context, int initialIndex) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        PageController pageController =
            PageController(initialPage: initialIndex);
        ValueNotifier<int> currentPage = ValueNotifier<int>(initialIndex);

        return Dialog(
          backgroundColor: Colors.black,
          insetPadding: EdgeInsets.zero,
          child: Stack(
            children: [
              PageView.builder(
                controller: pageController,
                itemCount: widget.product.images.length,
                onPageChanged: (int page) {
                  currentPage.value = page;
                },
                itemBuilder: (context, index) {
                  return Center(
                    child: Container(
                      color: Color(0xffF2F3F4),
                      child: Image.network(
                        '${ApiService.imageBaseUrl}${widget.product.images[index]}',
                        fit: BoxFit.contain,
                        width: MediaQuery.of(context).size.width,
                        errorBuilder: (context, error, stackTrace) =>
                            Icon(Icons.image, size: 50, color: Colors.grey),
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return Center(
                            child: CircularProgressIndicator(
                              value: loadingProgress.expectedTotalBytes != null
                                  ? loadingProgress.cumulativeBytesLoaded /
                                      (loadingProgress.expectedTotalBytes ?? 1)
                                  : null,
                            ),
                          );
                        },
                      ),
                    ),
                  );
                },
              ),
              Positioned(
                top: 16,
                left: 16,
                child: GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.close, color: Colors.white, size: 24),
                  ),
                ),
              ),
              Positioned(
                top: 16,
                right: 16,
                child: ValueListenableBuilder<int>(
                  valueListenable: currentPage,
                  builder: (context, value, child) {
                    return Container(
                      padding:
                          EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${value + 1}/${widget.product.images.length}',
                        style: TextStyle(color: Colors.white, fontSize: 16),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // void _showSuccessFlushbar(String message) {
  //   if (mounted) {
  //     Flushbar(
  //       message: message,
  //       duration: Duration(seconds: 3),
  //       backgroundColor: Colors.green,
  //       flushbarPosition: FlushbarPosition.TOP,
  //       margin: EdgeInsets.all(8),
  //       borderRadius: BorderRadius.circular(8),
  //       messageColor: Colors.white,
  //       icon: Icon(Icons.check_circle, color: Colors.white),
  //     )..show(context);
  //   }
  // }

  // void _showErrorFlushbar(String message) {
  //   if (mounted) {
  //     Flushbar(
  //       message: message,
  //       duration: Duration(seconds: 3),
  //       backgroundColor: Colors.red,
  //       flushbarPosition: FlushbarPosition.TOP,
  //       margin: EdgeInsets.all(8),
  //       borderRadius: BorderRadius.circular(8),
  //       icon: Icon(Icons.error, color: Colors.white),
  //     )..show(context);
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    // Cải thiện log để kiểm tra dữ liệu
    debugPrint('Product Data: ${widget.product.toString()}');
    debugPrint('Name: ${widget.product.nameProduct}');
    debugPrint('Price: ${widget.product.price}');
    debugPrint('Recap: ${widget.product.recap}');
    debugPrint('Description: ${widget.product.description}');

    return Scaffold(
      appBar: AppBar(
        title: Text('Thông tin sản phẩm'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Phần hiển thị ảnh (giữ nguyên)
            SizedBox(
              height: MediaQuery.of(context).size.height * 0.4,
              child: Stack(
                children: [
                  PageView.builder(
                    controller: _pageController,
                    itemCount: widget.product.images.length,
                    onPageChanged: (int page) {
                      setState(() {
                        selectedImageIndex = page;
                      });
                    },
                    itemBuilder: (context, index) {
                      return GestureDetector(
                        onTap: () => _showFullScreenImage(context, index),
                        child: Container(
                          color: Color(0xffF2F3F4),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              '${ApiService.imageBaseUrl}${widget.product.images[index]}',
                              fit: BoxFit.contain,
                              width: double.infinity,
                              errorBuilder: (context, error, stackTrace) =>
                                  Center(
                                child: Icon(Icons.image,
                                    size: 50, color: Colors.grey),
                              ),
                              loadingBuilder:
                                  (context, child, loadingProgress) {
                                if (loadingProgress == null) return child;
                                return Center(
                                  child: CircularProgressIndicator(
                                    value: loadingProgress.expectedTotalBytes !=
                                            null
                                        ? loadingProgress
                                                .cumulativeBytesLoaded /
                                            (loadingProgress
                                                    .expectedTotalBytes ??
                                                1)
                                        : null,
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                  Positioned(
                    bottom: 8,
                    right: 8,
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${selectedImageIndex + 1}/${widget.product.images.length}',
                        style: TextStyle(color: Colors.white, fontSize: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            if (widget.product.images.length > 1)
              SizedBox(
                height: 70,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: widget.product.images.length,
                  itemBuilder: (context, index) {
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          selectedImageIndex = index;
                          _pageController.animateToPage(
                            index,
                            duration: Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                          );
                        });
                      },
                      child: Container(
                        margin: EdgeInsets.only(right: 8),
                        padding: EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: selectedImageIndex == index
                                ? Colors.blueAccent
                                : Colors.grey,
                            width: 1.5,
                          ),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(3),
                          child: Image.network(
                            '${ApiService.imageBaseUrl}${widget.product.images[index]}',
                            width: 66,
                            height: 66,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                Icon(Icons.image, size: 50, color: Colors.grey),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            SizedBox(height: 16),
            Text(
              widget.product.nameProduct.isNotEmpty
                  ? widget.product.nameProduct
                  : 'Tên sản phẩm không có',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              "Giá: ${formatCurrency(widget.product.price)}",
              style: const TextStyle(fontSize: 18, color: Colors.green),
            ),
            SizedBox(height: 8),
            Text(
              "Số lượng: ${widget.product.quantity}",
              style: const TextStyle(fontSize: 16, color: Colors.black54),
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      selectedTab = 'description';
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: selectedTab == 'description'
                        ? Colors.blueAccent
                        : Colors.grey[300],
                    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5),
                    ),
                  ),
                  child: Text(
                    'Mô tả sản phẩm',
                    style: TextStyle(
                      color: selectedTab == 'description'
                          ? Colors.white
                          : Colors.black,
                      fontSize: 16,
                    ),
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      selectedTab = 'specifications';
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: selectedTab == 'specifications'
                        ? Colors.blueAccent
                        : Colors.grey[300],
                    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5),
                    ),
                  ),
                  child: Text(
                    'Thông số kỹ thuật',
                    style: TextStyle(
                      color: selectedTab == 'specifications'
                          ? Colors.white
                          : Colors.black,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            selectedTab == 'description'
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Tóm tắt:',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 8),
                      Text(
                        widget.product.recap.isNotEmpty
                            ? widget.product.recap
                            : 'Không có tóm tắt sản phẩm.',
                        style: TextStyle(fontSize: 16),
                      ),
                      SizedBox(height: 16),
                      Text(
                        'Mô tả chi tiết:',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 8),
                      Text(
                        widget.product.description.isNotEmpty
                            ? widget.product.description
                            : 'Không có mô tả chi tiết.',
                        style: TextStyle(fontSize: 16),
                      ),
                    ],
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Thông số kỹ thuật',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 8),
                      Text('Danh mục: ${widget.product.category}'),
                      Text('Số lượng: ${widget.product.quantity}'),
                      Text(
                          'Bo mạch chủ: ${widget.product.mainBoard?.isEmpty ?? true ? "Không có" : widget.product.mainBoard}'),
                      Text(
                          'Chip: ${widget.product.chip?.isEmpty ?? true ? "Không có" : widget.product.chip}'),
                      Text(
                          'CPU: ${widget.product.cpu?.isEmpty ?? true ? "Không có" : widget.product.cpu}'),
                      Text(
                          'GPU: ${widget.product.gpu?.isEmpty ?? true ? "Không có" : widget.product.gpu}'),
                      Text(
                          'RAM: ${widget.product.ram?.isEmpty ?? true ? "Không có" : widget.product.ram}'),
                      Text(
                          'Bộ nhớ: ${widget.product.memory?.isEmpty ?? true ? "Không có" : widget.product.memory}'),
                      Text(
                          'Phiên bản: ${widget.product.version?.isEmpty ?? true ? "Không có" : widget.product.version}'),
                      Text(
                          'Cổng kết nối: ${widget.product.ports?.isEmpty ?? true ? "Không có" : widget.product.ports}'),
                      Text(
                          'Kích thước màn hình: ${widget.product.displaySize?.isEmpty ?? true ? "Không có" : widget.product.displaySize}'),
                      Text(
                          'Mật độ điểm ảnh: ${widget.product.pixelDensity?.isEmpty ?? true ? "Không có" : widget.product.pixelDensity}'),
                      Text(
                          'Màn hình: ${widget.product.display?.isEmpty ?? true ? "Không có" : widget.product.display}'),
                      Text(
                          'Tần số quét: ${widget.product.refreshRate?.isEmpty ?? true ? "Không có" : widget.product.refreshRate}'),
                    ],
                  ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.all(10),
        color: Colors.white,
        child: ElevatedButton(
          onPressed: () async {
            // Giữ nguyên code gốc
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blueAccent,
            padding: EdgeInsets.symmetric(vertical: 15),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(5),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shopping_cart, color: Colors.white, size: 24),
              SizedBox(width: 10),
              Text(
                'Thêm vào giỏ hàng',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
