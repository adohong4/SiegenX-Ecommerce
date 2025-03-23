# Sử dụng image Node.js chính thức (phiên bản 18)
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở port mà ApiGateway sẽ chạy
EXPOSE 9004

# Sửa lệnh CMD để chạy script "dev" đúng cách
CMD ["npm", "run", "dev"]