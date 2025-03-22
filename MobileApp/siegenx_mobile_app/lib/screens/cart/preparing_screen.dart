import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/models/order.dart';
import 'package:siegenx_mobile_app/widgets/order_card_widget.dart';

class PreparingScreen extends StatelessWidget {
  final List<Order> orders;

  const PreparingScreen({super.key, required this.orders});

  @override
  Widget build(BuildContext context) {
    // Lọc các đơn hàng có trạng thái "Đang chuẩn bị hàng"
    final preparingOrders =
        orders.where((order) => order.status == "Đang chuẩn bị hàng").toList();

    return Scaffold(
      body: preparingOrders.isEmpty
          ? const Center(
              child: Text(
                "Không có đơn hàng đang chuẩn bị",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(0),
              itemCount: preparingOrders.length,
              itemBuilder: (context, index) {
                return OrderCardWidget(order: preparingOrders[index]);
              },
              separatorBuilder: (context, index) {
                return Divider(
                  color: Colors.grey[300],
                  thickness: 5,
                  height: 0,
                );
              },
            ),
    );
  }
}
