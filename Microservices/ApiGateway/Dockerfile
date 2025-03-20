# Sử dụng image Node.js chính thức (phiên bản 18)
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở port mà ApiGateway sẽ chạy (dựa trên cấu hình trước là 4001)
EXPOSE 4001

# Lệnh để chạy ứng dụng
CMD ["npm", "dev"]