import { faBoxArchive, faBox, faShoppingCart, faList, faDollarSign, faBook, faRotateRight } from '@fortawesome/free-solid-svg-icons';
// Fake data của Product
export const fakeProducts = [
    {
        _id: "1",
        title: "Màn hình LED P2.5",
        category: "Màn hình LED",
        price: 25000000,
        quantity: 10,

        images: ["led1.jpg"],
    },
    {
        _id: "2",
        title: "Màn hình quảng cáo LCD 43 inch",
        category: "MH quảng cáo LCD",
        price: 15000000,
        quantity: 5,
        images: ["lcd1.jpg"],
    },
    {
        _id: "3",
        title: "Màn hình tương tác 65 inch",
        category: "MH tương tác",
        price: 32000000,
        quantity: 3,
        images: ["touch1.jpg"],
    },
    {
        _id: "4",
        title: "Quảng cáo 3D OOH",
        category: "Quảng cáo 3D (OOH)",
        price: 50000000,
        quantity: 7,
        images: ["3d1.jpg"],
    },
    {
        _id: "9",
        title: "Màn hình LED P2.5",
        category: "Màn hình LED",
        price: 25000000,
        quantity: 10,
        images: ["led1.jpg"],
    },
    {
        _id: "10",
        title: "Màn hình quảng cáo LCD 43 inch",
        category: "MH quảng cáo LCD",
        price: 15000000,
        quantity: 5,
        images: ["lcd1.jpg"],
    },
    {
        _id: "3",
        title: "Màn hình tương tác 65 inch",
        category: "MH tương tác",
        price: 32000000,
        quantity: 3,
        images: ["touch1.jpg"],
    },
    {
        _id: "4",
        title: "Quảng cáo 3D OOH",
        category: "Quảng cáo 3D (OOH)",
        price: 50000000,
        quantity: 7,
        images: ["3d1.jpg"],
    },
    {
        _id: "5",
        title: "Màn hình LED P2.5",
        category: "Màn hình LED",
        price: 25000000,
        quantity: 10,
        images: ["led1.jpg"],
    },
    {
        _id: "6",
        title: "Màn hình quảng cáo LCD 43 inch",
        category: "MH quảng cáo LCD",
        price: 15000000,
        quantity: 5,
        images: ["lcd1.jpg"],
    },
    {
        _id: "7",
        title: "Màn hình tương tác 65 inch",
        category: "MH tương tác",
        price: 32000000,
        quantity: 3,
        images: ["touch1.jpg"],
    },
    {
        _id: "8",
        title: "Quảng cáo 3D OOH",
        category: "Quảng cáo 3D (OOH)",
        price: 50000000,
        quantity: 7,
        images: ["3d1.jpg"],
    },
    {
        _id: "11",
        title: "Màn hình tương tác 65 inch",
        category: "MH tương tác",
        price: 32000000,
        quantity: 3,
        images: ["touch1.jpg"],
    },
    {
        _id: "12",
        title: "Quảng cáo 3D OOH",
        category: "Quảng cáo 3D (OOH)",
        price: 50000000,
        quantity: 7,
        images: ["3d1.jpg"],
    },
];



// Fake data của Contact

export const fakeContacts = [
    {
        _id: "1",
        username: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0987654321",
        content: "Tôi muốn biết thêm thông tin về sản phẩm.",
        date: "2025-02-09",
        viewed: false
    },
    {
        _id: "2",
        username: "Trần Thị B",
        email: "tranthib@example.com",
        phone: "0912345678",
        content: "Xin tư vấn lắp đặt màn hình LED.",
        date: "2025-02-08",
        viewed: true
    },
    {
        _id: "3",
        username: "Lê Văn C",
        email: "levanc@example.com",
        phone: "0909123456",
        content: "Giá sản phẩm là bao nhiêu?",
        date: "2025-02-07",
        viewed: false
    }
];


// Fake data của ListUser

export const fakeListUser = [
    { _id: 1, username: "Nguyen Van A", email: "a@gmail.com", createdAt: "2024-02-10", address: ["Ha Noi"], cartData: { item1: 1, item2: 2 } },
    { _id: 2, username: "Tran Thi B", email: "b@gmail.com", createdAt: "2024-02-11", address: ["Hai Phong"], cartData: { item1: 1 } },
    { _id: 3, username: "Le Van C", email: "c@gmail.com", createdAt: "2024-02-12", address: ["Da Nang"], cartData: { item2: 3 } },
    { _id: 4, username: "Nguyen Van A", email: "a@gmail.com", createdAt: "2024-02-10", address: ["Ha Noi"], cartData: { item1: 1, item2: 2 } },
    { _id: 5, username: "Tran Thi B", email: "b@gmail.com", createdAt: "2024-02-11", address: ["Hai Phong"], cartData: { item1: 1 } },
    { _id: 6, username: "Le Van C", email: "c@gmail.com", createdAt: "2024-02-12", address: ["Da Nang"], cartData: { item2: 3 } }
];



// Fake data của Cart
export const fakeCart = [
    {
        _id: "1",
        date: "2025-02-13",
        address: {
            fullname: "Nguyễn Văn A",
            street: "123 Đường ABC",
            state: "Hà Nội",
            country: "Việt Nam",
            zipcode: "100000"
        },
        paymentMethod: "Thanh toán khi nhận hàng",
        amount: 1500000,
        status: "Đợi xác nhận",
        items: [
            { nameProduct: "Laptop Dell XPS 13", quantity: 1, price: 1500000 }
        ]
    },
    {
        _id: "2",
        date: "2025-02-12",
        address: {
            fullname: "Trần Thị B",
            street: "456 Đường XYZ",
            state: "TP Hồ Chí Minh",
            country: "Việt Nam",
            zipcode: "700000"
        },
        paymentMethod: "Chuyển khoản ngân hàng",
        amount: 5000000,
        status: "Đang giao hàng",
        items: [
            { nameProduct: "iPhone 14 Pro Max", quantity: 1, price: 5000000 }
        ]
    },
    {
        _id: "3",
        date: "2025-02-13",
        address: {
            fullname: "Nguyễn Văn A",
            street: "123 Đường ABC",
            state: "Hà Nội",
            country: "Việt Nam",
            zipcode: "100000"
        },
        paymentMethod: "Thanh toán khi nhận hàng",
        amount: 1500000,
        status: "Đợi xác nhận",
        items: [
            { nameProduct: "Laptop Dell XPS 13", quantity: 1, price: 1500000 }
        ]
    },
    {
        _id: "4",
        date: "2025-02-12",
        address: {
            fullname: "Trần Thị B",
            street: "456 Đường XYZ",
            state: "TP Hồ Chí Minh",
            country: "Việt Nam",
            zipcode: "700000"
        },
        paymentMethod: "Chuyển khoản ngân hàng",
        amount: 5000000,
        status: "Đang giao hàng",
        items: [
            { nameProduct: "iPhone 14 Pro Max", quantity: 1, price: 5000000 }
        ]
    },
    {
        _id: "5",
        date: "2025-02-13",
        address: {
            fullname: "Nguyễn Văn A",
            street: "123 Đường ABC",
            state: "Hà Nội",
            country: "Việt Nam",
            zipcode: "100000"
        },
        paymentMethod: "Thanh toán khi nhận hàng",
        amount: 1500000,
        status: "Đợi xác nhận",
        items: [
            { nameProduct: "Laptop Dell XPS 13", quantity: 1, price: 1500000 }
        ]
    },
    {
        _id: "6",
        date: "2025-02-12",
        address: {
            fullname: "Trần Thị B",
            street: "456 Đường XYZ",
            state: "TP Hồ Chí Minh",
            country: "Việt Nam",
            zipcode: "700000"
        },
        paymentMethod: "Chuyển khoản ngân hàng",
        amount: 5000000,
        status: "Đang giao hàng",
        items: [
            { nameProduct: "iPhone 14 Pro Max", quantity: 1, price: 5000000 }
        ]
    },
    {
        _id: "7",
        date: "2025-02-13",
        address: {
            fullname: "Nguyễn Văn A",
            street: "123 Đường ABC",
            state: "Hà Nội",
            country: "Việt Nam",
            zipcode: "100000"
        },
        paymentMethod: "Thanh toán khi nhận hàng",
        amount: 1500000,
        status: "Giao hàng thành công",
        items: [
            { nameProduct: "Laptop Dell XPS 13", quantity: 1, price: 1500000 }
        ]
    },
    {
        _id: "8",
        date: "2025-02-12",
        address: {
            fullname: "Trần Thị B",
            street: "456 Đường XYZ",
            state: "TP Hồ Chí Minh",
            country: "Việt Nam",
            zipcode: "700000"
        },
        paymentMethod: "Chuyển khoản ngân hàng",
        amount: 5000000,
        status: "Đang chuẩn bị hàng",
        items: [
            { nameProduct: "iPhone 14 Pro Max", quantity: 1, price: 5000000 }
        ]
    }
];


// Fakedata của Column
export const fakeFactorsData = {
    labels: ['Người dùng', 'Sản phẩm', 'Đơn hàng', 'Liên hệ'],
    datasets: [
        {
            label: 'Thống kê',
            data: [150, 320, 210, 85], // Dữ liệu giả lập
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(54, 162, 235, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        },
    ],
};


// Fake data Factor

export const fakeFactors = {
    user: 1200,      // Tổng số người dùng
    product: 350,    // Tổng số sản phẩm
    orders: 780,     // Tổng số đơn hàng
    contact: 150,    // Tổng số liên hệ
};
// Fake data Line char
export const fakePaymentsData = [
    { date: "2024-02-01", totalAmount: 1500000 },
    { date: "2024-02-02", totalAmount: 2200000 },
    { date: "2024-02-03", totalAmount: 1800000 },
    { date: "2024-02-04", totalAmount: 2500000 },
    { date: "2024-02-05", totalAmount: 2000000 },
    { date: "2024-02-06", totalAmount: 2750000 },
    { date: "2024-02-07", totalAmount: 3000000 },
];



// Fakedata cho ordertable
export const fakeOrderData = {
    data: [
        { _id: "ORD001", date: "2024-02-01", amount: 1500000, paymentMethod: "Chuyển khoản" },
        { _id: "ORD002", date: "2024-02-02", amount: 2200000, paymentMethod: "Tiền mặt" },
        { _id: "ORD003", date: "2024-02-03", amount: 1800000, paymentMethod: "Momo" },
        { _id: "ORD004", date: "2024-02-04", amount: 2500000, paymentMethod: "ZaloPay" },
        { _id: "ORD005", date: "2024-02-05", amount: 2000000, paymentMethod: "VNPay" },
        { _id: "ORD006", date: "2024-02-06", amount: 2750000, paymentMethod: "Chuyển khoản" },
    ],
    pagination: {
        limit: 6,
        totalPages: 3,
    }
};


export const stats = [
    { label: "Tổng sản phẩm", value: 28, animatedValue: 28, icon: faBox },
    { label: "Số lượng", value: 106, animatedValue: 106, icon: faShoppingCart },
    { label: "Tồn kho", value: 120, animatedValue: 120, icon: faBoxArchive },
    { label: "Danh mục", value: 5, animatedValue: 5, icon: faList }
];



export const fakeCustomerData = [
    { title: "Tổng số khách hàng", value: 25 },
    { title: "Khách hàng đã liên hệ", value: 3 },
    { title: "Khách hàng chưa liên hệ", value: 17 },
    { title: "Số khách hàng trong ngày", value: 12 }
];


//   Data cho trang nhập Hàng
export const orders = [
    { id: 1, code: "ABDKC125", date: "20/11/2024", types: 3, value: "20.000.000", status: "Hoàn tất", supplier: "NSX SiegenX", completed: true },
    { id: 2, code: "ABDKC126", date: "22/11/2024", types: 4, value: "15.000.000", status: "Chưa hoàn tất", supplier: "NSX SiegenX", completed: false },
    { id: 3, code: "ABDKC127", date: "23/11/2024", types: 6, value: "30.000.000", status: "Hoàn tất", supplier: "NSX SiegenX", completed: true },
    { id: 4, code: "ABDKC128", date: "24/11/2024", types: 2, value: "10.000.000", status: "Hoàn tất", supplier: "NSX SiegenX", completed: true },
    { id: 5, code: "ABDKC129", date: "25/11/2024", types: 5, value: "25.000.000", status: "Chưa hoàn tất", supplier: "NSX SiegenX", completed: false },
    { id: 6, code: "ABDKC130", date: "26/11/2024", types: 8, value: "40.000.000", status: "Hoàn tất", supplier: "NSX SiegenX", completed: true },
    { id: 7, code: "ABDKC128", date: "24/11/2024", types: 2, value: "10.000.000", status: "Hoàn tất", supplier: "NSX SiegenX", completed: true },
    { id: 8, code: "ABDKC129", date: "25/11/2024", types: 5, value: "25.000.000", status: "Chưa hoàn tất", supplier: "NSX SiegenX", completed: false },
    { id: 9, code: "ABDKC130", date: "26/11/2024", types: 8, value: "40.000.000", status: "Hoàn tất", supplier: "NSX SiegenX", completed: true },
];


//   fake data cho campain

export const campainlist = [
    {
        _id: "67b6d5ac35d13b959296faee",
        name: "Ngày quốc tế phụ nữ",
        description: "Chương trình giảm giá ngày quốc tế phụ nữ.",
        type: "percentage",
        value: 20,
        code: "WOMANDAY83",
        startDate: "2025-03-05",
        endDate: "2025-03-15",
        maxValue: 1000000,
        appliesTo: "items",
        productIds: [
            "6777cebdc3d18219bb6b0fc0",
            "676b7ebd899914bf0bea74e0",
            "67696a18e7ee9e89c3b45e5c",
        ],
        status: false,
    },
    {
        _id: "67b6cf3ca8452f193a459782",
        name: "Mua 2 sản phẩm, tặng 1 voucher 10k",
        description: "Khuyến mãi khi mua 2 sản phẩm bất kỳ.",
        type: "fixed",
        value: 10000,
        code: "BUY2GET10",
        startDate: "2025-04-01",
        endDate: "2025-04-10",
        maxValue: 500000,
        appliesTo: "orders",
        productIds: [],
        status: false,
    },
    {
        _id: "67b4560691f5c51fd3a720c2",
        name: "Giảm 10k / 1 sản phẩm nhân dịp chào mừng năm mới",
        description: "Ưu đãi đặc biệt mừng năm mới.",
        type: "fixed",
        value: 10000,
        code: "NEWYEAR10",
        startDate: "2025-01-01",
        endDate: "2025-01-10",
        maxValue: 300000,
        appliesTo: "items",
        productIds: ["678123abcd456efg789hij"],
        status: false,
    },
];

export const fakeOrder = {
    _id: "HD20250316001",
    address: {
        fullname: "Nguyễn Văn A",
        street: "123 Đường Lê Lợi",
        precinct: "Phường Bến Nghé",
        city: "Quận 1",
        province: "TP. Hồ Chí Minh"
    },
    amount: 12480000,
    createdAt: "2025-03-16T10:30:00Z",
    paymentMethod: "Chuyển khoản",
    status: "Đang giao hàng",
    items: [
        {
            id: "item1",
            title: "Tai nghe Sony WH-1000XM4",
            quantity: 1,
            price: 7500000,
            category: "Tai nghe",
            image: "sony-wh1000xm4.jpg"
        },
        {
            id: "item2",
            title: "Chuột Logitech MX Master 3S",
            quantity: 2,
            price: 2490000,
            category: "Chuột máy tính",
            image: "logitech-mx-master-3s.jpg"
        }
    ],
    creator: [
        {
            createdBy: "admin",
            action: "Tạo đơn hàng",
            createdAt: "2025-03-16T10:30:00Z"
        },
        {
            createdBy: "admin",
            action: "Cập nhật trạng thái: Đang giao hàng",
            createdAt: "2025-03-17T08:00:00Z"
        }
    ]
};
