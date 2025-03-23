import 'package:another_flushbar/flushbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:siegenx_mobile_app/controllers/add_cart.dart';
import 'package:siegenx_mobile_app/models/product.dart';
import 'package:siegenx_mobile_app/services/api_service.dart';
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'package:siegenx_mobile_app/utils/format_untils.dart';

class AddToCartBottomSheet extends StatefulWidget {
  final Product product;

  const AddToCartBottomSheet({Key? key, required this.product})
      : super(key: key);

  @override
  _AddToCartBottomSheetState createState() => _AddToCartBottomSheetState();
}

class _AddToCartBottomSheetState extends State<AddToCartBottomSheet> {
  int quantity = 1;
  int selectedImageIndex = 0; // Theo dõi ảnh được chọn

  int calculateDiscountPercentage(double price, double newPrice) {
    return (((price - newPrice) / price) * 100).round();
  }

  // Hàm hiển thị dialog phóng to ảnh
  void _showFullScreenImage(BuildContext context, int initialIndex) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        PageController pageController =
            PageController(initialPage: initialIndex);
        ValueNotifier<int> currentPage = ValueNotifier<int>(initialIndex);

        return Dialog(
          backgroundColor: Colors.black, // Nền chính vẫn là màu đen
          insetPadding: EdgeInsets.zero,
          child: Stack(
            children: [
              // PageView để vuốt qua các ảnh
              PageView.builder(
                controller: pageController,
                itemCount: widget.product.images.length,
                onPageChanged: (int page) {
                  currentPage.value = page;
                },
                itemBuilder: (context, index) {
                  return Center(
                    child: Container(
                      color: Color(0xffF2F3F4), // Nền trắng cho ảnh PNG
                      child: Image.network(
                        '${ApiService.imageBaseUrl}${widget.product.images[index]}',
                        fit: BoxFit.contain, // Giữ tỷ lệ ảnh gốc
                        width: MediaQuery.of(context)
                            .size
                            .width, // Full chiều rộng màn hình
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
              // Nút "X" ở góc trên trái
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
              // Số thứ tự ảnh ở góc trên phải
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

  void _showSuccessFlushbar(String message) {
    if (mounted) {
      Flushbar(
        message: message,
        duration: Duration(seconds: 3),
        backgroundColor: Colors.green, // Màu xanh giống button
        flushbarPosition: FlushbarPosition.TOP,
        margin: EdgeInsets.all(8),
        borderRadius: BorderRadius.circular(8),
        messageColor: Colors.white,
        icon: Icon(
          Icons.check_circle,
          color: Colors.white,
        ),
      )..show(context);
    }
  }

  void _showErrorFlushbar(String message) {
    if (mounted) {
      Flushbar(
        message: message,
        duration: Duration(seconds: 3),
        backgroundColor: Colors.red,
        flushbarPosition: FlushbarPosition.TOP,
        margin: EdgeInsets.all(8),
        borderRadius: BorderRadius.circular(8),
        icon: Icon(
          Icons.error,
          color: Colors.white,
        ),
        leftBarIndicatorColor: Colors.white,
      )..show(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      height: 400,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hàng 1: Hình ảnh + Giá tiền
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              GestureDetector(
                onTap: () => _showFullScreenImage(context, selectedImageIndex),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    '${ApiService.imageBaseUrl}${widget.product.images.isNotEmpty ? widget.product.images[selectedImageIndex] : ''}',
                    width: 100,
                    height: 100,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        Icon(Icons.image, size: 50, color: Colors.grey),
                  ),
                ),
              ),
              SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.product.newPrice != null
                        ? formatCurrency(widget.product.newPrice!)
                        : formatCurrency(widget.product.price),
                    style: TextStyle(
                      fontSize: 22,
                      color: Color(0xFF00B98E),
                    ),
                  ),
                  Row(
                    children: [
                      if (widget.product.newPrice != null)
                        Text(
                          formatCurrency(widget.product.price),
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      SizedBox(width: 8),
                      if (widget.product.newPrice != null)
                        Text(
                          '-${calculateDiscountPercentage(widget.product.price, widget.product.newPrice!)}%',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textColorRed,
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          SizedBox(height: 16),

          // Hàng 2: Thumbnails
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Hình ảnh',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 8),
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
                        });
                      },
                      child: Container(
                        margin: EdgeInsets.only(right: 8),
                        padding: EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: selectedImageIndex == index
                                ? AppColors.primaryColor
                                : Color(0xff808B96),
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
            ],
          ),
          SizedBox(height: 16),

          // Hàng 3: Số lượng
          // Thay thế phần Row số lượng cũ bằng code mới này
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Số lượng',
                style: TextStyle(fontSize: 16),
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        if (quantity > 1) {
                          setState(() {
                            quantity--;
                          });
                        }
                      },
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: Text('-', style: TextStyle(fontSize: 20)),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        // Hiển thị dialog để nhập số lượng
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            TextEditingController quantityController =
                                TextEditingController(
                                    text: quantity.toString());
                            return AlertDialog(
                              title: Text('Nhập số lượng'),
                              content: TextField(
                                controller: quantityController,
                                keyboardType: TextInputType.number,
                                inputFormatters: [
                                  FilteringTextInputFormatter
                                      .digitsOnly // Chỉ cho phép nhập số
                                ],
                                decoration: InputDecoration(
                                  hintText: 'Nhập số lượng (tối thiểu 1)',
                                ),
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: Text('Hủy'),
                                ),
                                TextButton(
                                  onPressed: () {
                                    String input = quantityController.text;
                                    if (input.isNotEmpty) {
                                      int? newQuantity = int.tryParse(input);
                                      if (newQuantity != null &&
                                          newQuantity >= 1) {
                                        setState(() {
                                          quantity = newQuantity;
                                        });
                                      }
                                    }
                                    Navigator.pop(context);
                                  },
                                  child: Text('Xác nhận'),
                                ),
                              ],
                            );
                          },
                        );
                      },
                      child: Container(
                        width: 40,
                        alignment: Alignment.center,
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: Text(
                          '$quantity',
                          style: TextStyle(fontSize: 16),
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          quantity++;
                        });
                      },
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: Text('+', style: TextStyle(fontSize: 18)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 16),

          // Hàng 4: Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () async {
                try {
                  for (int i = 0; i < quantity; i++) {
                    await AddCartController.addToCart(
                        context, widget.product.id);
                  }
                  if (mounted) {
                    Navigator.pop(context);
                    _showSuccessFlushbar(
                        'Đã thêm vào giỏ hàng'); // Thay thế SnackBar
                  }
                } catch (e) {
                  if (mounted) {
                    _showErrorFlushbar(
                        'Lỗi khi thêm vào giỏ hàng: $e'); // Thay thế SnackBar lỗi
                  }
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF00B98E),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Thêm vào giỏ hàng',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
