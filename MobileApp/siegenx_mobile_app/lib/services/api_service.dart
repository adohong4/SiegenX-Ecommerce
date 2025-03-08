class ApiService {
  static const String baseUrl = "http://localhost:4001/v1/api";
  static const String imageBaseUrl = "http://localhost:9003/images/";

  static const String identity = "$baseUrl/identity";
  static const String profile = "$baseUrl/profile";
  static const String product = "$baseUrl/product";
  static const String contact = "$baseUrl/contact";

  static const String login = "$identity/login";
  static const String register = "$identity/register";
  static const String userProfile = "$profile/getProfile";
  static const String productList = "$product/list";
  static const String contactSupport = "$contact/support";
  static const String addAddress = "$profile/address/create";
  static const String listAddresses = "$profile/address/getList";
  static const String logout = "$identity/logout";
  static const String deleteAddress = "$profile/address/delete";

  static const String getAllProducts = "$product/getAll";
  static const String updateProfile = "$profile/update";
}
