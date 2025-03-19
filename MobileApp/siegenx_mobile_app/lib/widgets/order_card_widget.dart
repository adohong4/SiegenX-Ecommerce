import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/models/order.dart';
import 'package:intl/intl.dart'; // Import thêm package intl
import 'package:siegenx_mobile_app/themes/app_colors.dart';
import 'order_item_widget.dart';

class OrderCardWidget extends StatelessWidget {
  final Order order;

  const OrderCardWidget({super.key, required this.order});

  String _formatAddress(Order order) {
    if (order.address != null) {
      final addr = order.address!;
      return '${addr.street}, ${addr.precinct}\n${addr.city}, ${addr.province}';
    }
    return 'Địa chỉ không khả dụng';
  }

  String formatCurrency(double amount) {
    final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: 'đ');
    return formatter.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white, // Nền trắng
      margin: const EdgeInsets.symmetric(vertical: 0, horizontal: 0),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hàng 1: List item sản phẩm
            Column(
              children: order.items
                  .map((item) => Padding(
                        padding: const EdgeInsets.only(
                            bottom: 15.0), // Thêm khoảng cách height 15
                        child: OrderItemWidget(item: item),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 20),
            // Hàng 2: Địa chỉ và thời gian
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Image.asset(
                        'assets/icons/delivery.png', // Đường dẫn tới icon địa chỉ của bạn
                        width: 22,
                        height: 22,
                      ),
                      const SizedBox(width: 15),
                      Expanded(
                        child: Text(
                          _formatAddress(order),
                          style: const TextStyle(
                            fontSize: 14,
                            // color: Color(0xff808B96),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Row(
                  children: [
                    Image.asset(
                      'assets/icons/time.png', // Đường dẫn tới icon thời gian của bạn
                      width: 18,
                      height: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      order.date,
                      style: const TextStyle(
                        fontSize: 14,
                        // color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Hàng 3: Payment method và tổng tiền
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  width: 120, // Điều chỉnh chiều rộng của Container
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(vertical: 5, horizontal: 0),
                    decoration: BoxDecoration(
                      color: order.payment
                          ? AppColors.primaryColor
                          : Color(0xffE1E2E3),
                      borderRadius: BorderRadius.circular(5), // Bo góc 5
                    ),
                    child: Text(
                      order.payment ? 'Đã thanh toán' : 'Chưa thanh toán',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: order.payment ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text(
                        'Vận chuyển: 50.000 đ',
                        style: TextStyle(fontSize: 15),
                      ),
                      const SizedBox(height: 4),
                      RichText(
                        text: TextSpan(
                          text: '${order.items.length} mặt hàng: ',
                          style: const TextStyle(
                            fontSize: 15,
                            color: Colors.black,
                          ),
                          children: [
                            TextSpan(
                              text: formatCurrency(order.amount + 50000),
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold, // Làm chữ đậm
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
