class ApiService {
  static const String baseUrl =
      "http://localhost:4001/v1/api"; // Cổng API Gateway

  // Định nghĩa các endpoint cho từng service
  static const String identity = "$baseUrl/identity";
  static const String profile = "$baseUrl/profile";
  static const String product = "$baseUrl/product";
  static const String contact = "$baseUrl/contact";

  // Các API cụ thể
  static const String login = "$identity/login";
  static const String register = "$identity/register";
  static const String userProfile = "$profile/getProfile";
  static const String productList = "$product/list";
  static const String contactSupport = "$contact/support";
  static const String addAddress = "$profile/address/create";
  static const String listAddresses = "$profile/address/getList";
  static const String logout = "$identity/logout"; // Thêm endpoint này
  static const String deleteAddress = "$profile/address/delete";
}
