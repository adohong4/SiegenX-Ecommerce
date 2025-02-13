
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
