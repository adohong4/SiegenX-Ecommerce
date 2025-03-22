import 'package:flutter/material.dart';
import 'package:siegenx_mobile_app/models/order.dart';
import 'package:siegenx_mobile_app/widgets/order_card_widget.dart';
// import 'order_item_widget.dart';

class ShippingScreen extends StatelessWidget {
  final List<Order> orders;

  const ShippingScreen({super.key, required this.orders});

  @override
  Widget build(BuildContext context) {
    // Lọc các đơn hàng có trạng thái "Đang giao hàng"
    final shippingOrders =
        orders.where((order) => order.status == "Đang giao hàng").toList();

    return Scaffold(
      body: shippingOrders.isEmpty
          ? const Center(
              child: Text(
                "Không có đơn hàng đang giao",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(0),
              itemCount: shippingOrders.length,
              itemBuilder: (context, index) {
                return OrderCardWidget(order: shippingOrders[index]);
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
