// import 'package:flutter/material.dart';

// class NoInternetScreen extends StatelessWidget {
//   const NoInternetScreen({Key? key}) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Icon(
//               Icons.wifi_off,
//               size: 80,
//               color: Colors.grey,
//             ),
//             SizedBox(height: 16),
//             Text(
//               'Không có kết nối Internet',
//               style: TextStyle(
//                 fontSize: 20,
//                 fontWeight: FontWeight.bold,
//                 color: Colors.black87,
//               ),
//             ),
//             SizedBox(height: 8),
//             Text(
//               'Vui lòng kiểm tra kết nối và thử lại.',
//               style: TextStyle(
//                 fontSize: 16,
//                 color: Colors.black54,
//               ),
//               textAlign: TextAlign.center,
//             ),
//             SizedBox(height: 24),
//             ElevatedButton(
//               onPressed: () {
//                 // Quay lại màn hình trước đó hoặc thử lại
//                 Navigator.pop(context);
//               },
//               style: ElevatedButton.styleFrom(
//                 backgroundColor: Colors.blue,
//                 shape: RoundedRectangleBorder(
//                   borderRadius: BorderRadius.circular(8),
//                 ),
//                 padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
//               ),
//               child: Text(
//                 'Thử lại',
//                 style: TextStyle(
//                   fontSize: 16,
//                   color: Colors.white,
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
