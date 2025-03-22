// import 'dart:async';
// import 'package:connectivity_plus/connectivity_plus.dart';
// import 'package:flutter/material.dart';
// import 'package:siegenx_mobile_app/screens/no_internet_screen.dart';

// class ConnectivityService {
//   static final ConnectivityService _instance = ConnectivityService._internal();
//   factory ConnectivityService() => _instance;
//   ConnectivityService._internal();

//   final Connectivity _connectivity = Connectivity();
//   StreamSubscription<ConnectivityResult>? _connectivitySubscription;

//   // Stream để thông báo trạng thái kết nối
//   final _connectionController = StreamController<bool>.broadcast();
//   Stream<bool> get connectionStream => _connectionController.stream;

//   bool _isConnected = true;
//   bool get isConnected => _isConnected;

//   Future<void> initialize(BuildContext context) async {
//     // Kiểm tra trạng thái ban đầu
//     _isConnected = await _checkConnection();
//     _connectionController.add(_isConnected);

//     // Lắng nghe sự thay đổi kết nối
//     _connectivitySubscription =
//         _connectivity.onConnectivityChanged.listen((result) async {
//       _isConnected = result != ConnectivityResult.none;
//       _connectionController.add(_isConnected);

//       // Nếu mất kết nối, hiển thị NoInternetScreen
//       if (!_isConnected) {
//         Navigator.push(
//           context,
//           MaterialPageRoute(
//             builder: (context) => NoInternetScreen(),
//             fullscreenDialog: true,
//           ),
//         );
//       }
//     }) as StreamSubscription<ConnectivityResult>?;
//   }

//   Future<bool> _checkConnection() async {
//     final result = await _connectivity.checkConnectivity();
//     return result != ConnectivityResult.none;
//   }

//   void dispose() {
//     _connectivitySubscription?.cancel();
//     _connectionController.close();
//   }
// }
