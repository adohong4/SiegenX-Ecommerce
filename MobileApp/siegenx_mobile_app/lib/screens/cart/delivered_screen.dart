import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/models/order.dart';
import 'package:siegenx_mobile_app/widgets/order_card_widget.dart';
// import 'order_item_widget.dart';

class DeliveredScreen extends StatelessWidget {
  final List<Order> orders;

  const DeliveredScreen({super.key, required this.orders});

  @override
  Widget build(BuildContext context) {
    // Lọc các đơn hàng có trạng thái "Giao hàng thành công"
    final deliveredOrders = orders
        .where((order) => order.status == "Giao hàng thành công")
        .toList();

    return Scaffold(
      body: deliveredOrders.isEmpty
          ? const Center(
              child: Text(
                "Không có đơn hàng giao thành công",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(0),
              itemCount: deliveredOrders.length,
              itemBuilder: (context, index) {
                return OrderCardWidget(order: deliveredOrders[index]);
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
