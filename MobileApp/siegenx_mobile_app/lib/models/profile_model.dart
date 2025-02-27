import 'dart:convert';

class Profile {
  final String username;
  final String email;
  final String? password;
  final String role;
  final String? fullName;
  final DateTime? dateOfBirth;
  final String? profilePic;
  final String? numberPhone;
  final String? gender;
  final List<Address>? address;
  final Map<String, dynamic> cartData;
  final bool active;
  final List<History>? creator;
  final DateTime createdAt;
  final DateTime updatedAt;

  Profile({
    required this.username,
    required this.email,
    this.password,
    required this.role,
    this.fullName,
    this.dateOfBirth,
    this.profilePic,
    this.numberPhone,
    this.gender,
    this.address,
    this.cartData = const {},
    this.active = true,
    this.creator,
    required this.createdAt,
    required this.updatedAt,
  });

  // Chuyển đổi từ JSON sang Object
  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      username: json['username'],
      email: json['email'],
      password: json['password'],
      role: json['role'],
      fullName: json['fullName'],
      dateOfBirth: json['dateOfBirth'] != null
          ? DateTime.parse(json['dateOfBirth'])
          : null,
      profilePic: json['profilePic'],
      numberPhone: json['numberPhone'],
      gender: json['gender'],
      address: json['address'] != null
          ? (json['address'] as List).map((e) => Address.fromJson(e)).toList()
          : null,
      cartData: json['cartData'] ?? {},
      active: json['active'] ?? true,
      creator: json['creator'] != null
          ? (json['creator'] as List).map((e) => History.fromJson(e)).toList()
          : null,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  // Chuyển đổi từ Object sang JSON
  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'email': email,
      'password': password,
      'role': role,
      'fullName': fullName,
      'dateOfBirth': dateOfBirth?.toIso8601String(),
      'profilePic': profilePic,
      'numberPhone': numberPhone,
      'gender': gender,
      'address': address?.map((e) => e.toJson()).toList(),
      'cartData': cartData,
      'active': active,
      'creator': creator?.map((e) => e.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

// Model Address
class Address {
  final String street;
  final String city;
  final String state;
  final String country;
  final String zipCode;

  Address({
    required this.street,
    required this.city,
    required this.state,
    required this.country,
    required this.zipCode,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      street: json['street'],
      city: json['city'],
      state: json['state'],
      country: json['country'],
      zipCode: json['zipCode'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'street': street,
      'city': city,
      'state': state,
      'country': country,
      'zipCode': zipCode,
    };
  }
}

// Model History
class History {
  final String action;
  final DateTime timestamp;

  History({
    required this.action,
    required this.timestamp,
  });

  factory History.fromJson(Map<String, dynamic> json) {
    return History(
      action: json['action'],
      timestamp: DateTime.parse(json['timestamp']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'action': action,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}
