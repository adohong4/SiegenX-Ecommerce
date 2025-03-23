import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/models/order.dart';
import 'package:siegenx_mobile_app/widgets/order_card_widget.dart';

class PendingScreen extends StatelessWidget {
  final List<Order> orders;

  const PendingScreen({super.key, required this.orders});

  @override
  Widget build(BuildContext context) {
    final pendingOrders =
        orders.where((order) => order.status == "Đợi xác nhận").toList();

    return Scaffold(
      body: pendingOrders.isEmpty
          ? const Center(
              child: Text(
                "Không có đơn hàng chờ xác nhận",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(0),
              itemCount: pendingOrders.length,
              itemBuilder: (context, index) {
                return OrderCardWidget(order: pendingOrders[index]);
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
