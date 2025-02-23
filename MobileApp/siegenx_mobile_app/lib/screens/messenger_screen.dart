import 'package:flutter/material.dart';

class MessengerScreen extends StatefulWidget {
  @override
  _MessengerScreenState createState() => _MessengerScreenState();
}

class _MessengerScreenState extends State<MessengerScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];

  final List<String> _autoReplies = [
    "Xin chào!",
    "Hôm nay tôi có thể giúp gì cho bạn?",
    "Bạn cần hỗ trợ về vấn đề gì?",
    "Cảm ơn bạn đã liên hệ!",
    "Chúc bạn một ngày tốt lành!"
  ];

  void _sendMessage(String message) {
    if (message.trim().isEmpty) return;
    setState(() {
      _messages.add({"sender": "user", "text": message});
      Future.delayed(Duration(milliseconds: 500), () {
        setState(() {
          _messages.add({
            "sender": "bot",
            "text": _autoReplies[_messages.length % _autoReplies.length]
          });
        });
      });
    });
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/icons/customer_service.png', // Ảnh từ assets
              width: 35,
              height: 35,
              fit: BoxFit.cover,
            ),
            SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Dịch vụ chăm sóc khách hàng",
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text("thường phản hồi sau khoảng 5-10p",
                    style: TextStyle(fontSize: 12, color: Colors.grey)),
              ],
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, color: Colors.black), // Đường kẻ đen
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(10),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                final isUser = message["sender"] == "user";

                return Align(
                  alignment:
                      isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: EdgeInsets.symmetric(vertical: 5),
                    padding: EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: isUser
                          ? Color(0xFF00B98E)
                          : Colors.grey[300], // Màu người dùng gửi là 00B98E
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      message["text"]!,
                      style: TextStyle(
                        fontSize: 16,
                        color: isUser
                            ? Colors.white
                            : Colors
                                .black, // Chữ màu trắng nếu là tin nhắn người dùng
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: EdgeInsets.all(10),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: "Nhập tin nhắn...",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.add_photo_alternate, color: Colors.grey),
                  onPressed: () {
                    // Chọn ảnh (Chưa implement)
                  },
                ),
                IconButton(
                  icon: Icon(Icons.send_rounded, color: Color(0xFF00B98E)),
                  onPressed: () => _sendMessage(_controller.text),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
