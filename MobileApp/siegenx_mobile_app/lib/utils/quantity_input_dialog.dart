// utils/quantity_input_dialog.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

Future<int?> showQuantityInputDialog(
    BuildContext context, int currentQuantity) async {
  TextEditingController quantityController =
      TextEditingController(text: currentQuantity.toString());

  return showDialog<int>(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text('Nhập số lượng'),
        content: TextField(
          controller: quantityController,
          keyboardType: TextInputType.number,
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly // Chỉ cho phép nhập số
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
                if (newQuantity != null && newQuantity >= 1) {
                  Navigator.pop(context, newQuantity);
                }
              }
            },
            child: Text('Xác nhận'),
          ),
        ],
      );
    },
  );
}
