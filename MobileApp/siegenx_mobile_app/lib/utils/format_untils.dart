import 'package:intl/intl.dart';

String formatCurrency(int amount) {
  final formatter = NumberFormat.currency(locale: 'vi_VN', symbol: 'đ');
  return formatter.format(amount);
}
