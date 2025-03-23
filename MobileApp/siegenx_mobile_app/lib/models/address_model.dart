class AddressModel {
  final String? userId; // Thêm userId nếu cần thiết
  final String fullname;
  final String phone;
  final String street;
  final String precinct;
  final String city;
  final String province;
  final String? id; // _id từ response

  AddressModel({
    this.userId,
    required this.fullname,
    required this.phone,
    required this.street,
    required this.precinct,
    required this.city,
    required this.province,
    this.id,
  });

  factory AddressModel.fromJson(Map<String, dynamic> json) {
    return AddressModel(
      userId: json['userId'],
      fullname: json['fullname'],
      phone: json['phone'],
      street: json['street'],
      precinct: json['precinct'],
      city: json['city'],
      province: json['province'],
      id: json['_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'fullname': fullname,
      'phone': phone,
      'street': street,
      'precinct': precinct,
      'city': city,
      'province': province,
    };
  }
}

class AddressResponse {
  final int status;
  final String message;
  final List<AddressModel> metadata;

  AddressResponse({
    required this.status,
    required this.message,
    required this.metadata,
  });

  factory AddressResponse.fromJson(Map<String, dynamic> json) {
    return AddressResponse(
      status: json['status'],
      message: json['message'],
      metadata: (json['metadata'] as List)
          .map((item) => AddressModel.fromJson(item))
          .toList(),
    );
  }
}
