class Contact {
  final int id;
  final String username;
  final String email;
  final String phone;
  final String content;
  final bool isCheck;
  final DateTime date;
  final DateTime createdAt;
  final DateTime updatedAt;

  Contact({
    required this.id,
    required this.username,
    required this.email,
    required this.phone,
    required this.content,
    required this.isCheck,
    required this.date,
    required this.createdAt,
    required this.updatedAt,
  });

  // Chuyển đổi từ JSON sang Object
  factory Contact.fromJson(Map<String, dynamic> json) {
    return Contact(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      phone: json['phone'],
      content: json['content'],
      isCheck: json['isCheck'],
      date: DateTime.parse(json['date']),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  // Chuyển đổi từ Object sang JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'phone': phone,
      'content': content,
      'isCheck': isCheck,
      'date': date.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
