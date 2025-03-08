import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:siegenx_mobile_app/screens/manager_screen.dart';
import 'package:siegenx_mobile_app/controllers/profile_controller.dart';

class EnterInformationScreen extends StatelessWidget {
  final String token;
  final String userId;

  const EnterInformationScreen({
    Key? key,
    required this.token,
    required this.userId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      body: Center(
        child: isSmallScreen
            ? Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    _Header(),
                    _FormContent(),
                  ],
                ),
              )
            : Container(
                padding: const EdgeInsets.all(32.0),
                constraints: const BoxConstraints(maxWidth: 800),
                child: Row(
                  children: const [
                    Expanded(child: _Header()),
                    Expanded(
                      child: Center(child: _FormContent()),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsetsDirectional.only(
              start: 0.0, top: 16.0, bottom: 20),
          child: IconButton(
            icon: Icon(
              Icons.arrow_back,
              color: Colors.black87,
              size: 28,
            ),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ),
        Padding(
          padding: const EdgeInsetsDirectional.only(start: 0.0, bottom: 30),
          child: Text(
            "Nhập thông tin tài khoản",
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
        ),
      ],
    );
  }
}

class _FormContent extends StatefulWidget {
  const _FormContent({Key? key}) : super(key: key);

  @override
  State<_FormContent> createState() => __FormContentState();
}

class __FormContentState extends State<_FormContent> {
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  DateTime? _dateOfBirth;
  String? _gender;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final ProfileController _profileController = ProfileController();
  bool _isLoading = false;

  String _formatPhoneNumber(String value) {
    String digits = value.replaceAll(RegExp(r'[^0-9]'), '');
    if (digits.length > 4 && digits.length <= 7) {
      return '${digits.substring(0, 4)}.${digits.substring(4)}';
    } else if (digits.length > 7) {
      return '${digits.substring(0, 4)}.${digits.substring(4, 7)}.${digits.substring(7, digits.length > 10 ? 10 : digits.length)}';
    }
    return digits;
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _dateOfBirth) {
      setState(() {
        _dateOfBirth = picked;
      });
    }
  }

  Future<void> _handleUpdateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final EnterInformationScreen widgetScreen =
        context.findAncestorWidgetOfExactType<EnterInformationScreen>()!;

    final result = await _profileController.updateProfile(
      token: widgetScreen.token,
      userId: widgetScreen.userId,
      fullName: _fullNameController.text,
      dateOfBirth: _dateOfBirth!.toIso8601String().split('T')[0],
      numberPhone: _phoneController.text.replaceAll('.', ''),
      gender: _gender!,
    );

    setState(() {
      _isLoading = false;
    });

    if (result['success']) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'])),
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => ManagerScreen()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'])),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 350),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 10),
            TextFormField(
              controller: _fullNameController,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập họ và tên';
                }
                return null;
              },
              decoration: const InputDecoration(
                labelText: 'Họ và tên',
                prefixIcon: Padding(
                  padding: EdgeInsets.all(12.0),
                  child: Image(
                    image: AssetImage('assets/icons/user.png'),
                    width: 24,
                    height: 24,
                  ),
                ),
                filled: true,
                fillColor: Color(0xffF2F3F4),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 16.0),
              ),
            ),
            _gap(),
            GestureDetector(
              onTap: () => _selectDate(context),
              child: AbsorbPointer(
                child: TextFormField(
                  validator: (value) {
                    if (_dateOfBirth == null) {
                      return 'Vui lòng chọn ngày sinh';
                    }
                    return null;
                  },
                  decoration: InputDecoration(
                    labelStyle: TextStyle(color: Color(0xff00B98E)),
                    prefixIcon: Padding(
                      padding: EdgeInsets.all(12.0),
                      child: Image(
                        image: AssetImage('assets/icons/calendar.png'),
                        width: 24,
                        height: 24,
                      ),
                    ),
                    hintText: _dateOfBirth == null
                        ? 'Chọn ngày sinh'
                        : '${_dateOfBirth!.day}/${_dateOfBirth!.month}/${_dateOfBirth!.year}',
                    filled: true,
                    fillColor: Color(0xffF2F3F4),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 16.0),
                  ),
                ),
              ),
            ),
            _gap(),
            TextFormField(
              controller: _phoneController,
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(10),
                TextInputFormatter.withFunction((oldValue, newValue) {
                  String formatted = _formatPhoneNumber(newValue.text);
                  return TextEditingValue(
                    text: formatted,
                    selection:
                        TextSelection.collapsed(offset: formatted.length),
                  );
                }),
              ],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Vui lòng nhập số điện thoại';
                }
                String digits = value.replaceAll(RegExp(r'[^0-9]'), '');
                if (digits.length != 10) {
                  return 'Số điện thoại phải có đúng 10 số';
                }
                return null;
              },
              decoration: const InputDecoration(
                labelText: 'Số điện thoại',
                prefixIcon: Padding(
                  padding: EdgeInsets.all(12.0),
                  child: Image(
                    image: AssetImage('assets/icons/phone.png'),
                    width: 24,
                    height: 24,
                  ),
                ),
                filled: true,
                fillColor: Color(0xffF3F3F4),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 16.0),
              ),
            ),
            _gap(),
            DropdownButtonFormField<String>(
              value: _gender,
              validator: (value) {
                if (value == null) {
                  return 'Vui lòng chọn giới tính';
                }
                return null;
              },
              items: ['Nam', 'Nữ'].map((String gender) {
                return DropdownMenuItem<String>(
                  value: gender,
                  child: Text(gender),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _gender = value;
                });
              },
              decoration: const InputDecoration(
                labelText: 'Giới tính',
                prefixIcon: Padding(
                  padding: EdgeInsets.all(12.0),
                  child: Image(
                    image: AssetImage('assets/icons/gender.png'),
                    width: 24,
                    height: 24,
                  ),
                ),
                filled: true,
                fillColor: Color(0xffF2F3F4),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 16.0),
              ),
            ),
            _gap(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xff00B98E),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                onPressed: _isLoading ? null : _handleUpdateProfile,
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: _isLoading
                      ? CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'ĐĂNG KÝ',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _gap() => const SizedBox(height: 16);
}
