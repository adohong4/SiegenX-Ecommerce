import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaCartPlus, FaEnvelope } from "react-icons/fa";
import { toast } from 'react-toastify';
import '../styles/styles.css';

// Fake data
const fakedata = {
  product_slug: [
    {
      _id: "1",
      slug: "man-hinh-led-1",
      nameProduct: "Laptop Dell XPS 15",
      price: 35000000,
      quantity: 10,
      recap: "Laptop hiệu năng cao dành cho dân công nghệ.",
      description: "Dell XPS 15 được trang bị CPU Intel Core i7, RAM 16GB, SSD 512GB và màn hình 4K UHD.",
      mainBoard: "Intel HM470",
      chip: "Intel Core i7-10750H",
      cpu: "6 nhân 12 luồng, 2.6GHz - 5.0GHz",
      gpu: "NVIDIA GTX 1650 Ti",
      ram: "16GB DDR4",
      memory: "512GB SSD NVMe",
      version: "2023",
      ports: "USB-C, HDMI, SD Card",
      displaySize: "15.6 inch",
      pixelDensity: "282 PPI",
      display: "OLED 4K",
      refreshRate: "60Hz",
      images: ["laptop1.jpg", "laptop2.jpg", "laptop3.jpg"]
    },
    {
      _id: "2",
      slug: "macbook-pro-m2",
      nameProduct: "MacBook Pro M2",
      price: 42000000,
      quantity: 5,
      recap: "Hiệu suất đỉnh cao với chip Apple M2.",
      description: "MacBook Pro M2 sở hữu hiệu năng mạnh mẽ, thời lượng pin lên đến 20 giờ.",
      mainBoard: "Apple Silicon",
      chip: "Apple M2",
      cpu: "8 nhân CPU",
      gpu: "10 nhân GPU",
      ram: "16GB Unified Memory",
      memory: "512GB SSD",
      version: "2023",
      ports: "Thunderbolt 4, MagSafe",
      displaySize: "14 inch",
      pixelDensity: "250 PPI",
      display: "Retina Display",
      refreshRate: "120Hz",
      images: ["macbook1.jpg", "macbook2.jpg", "macbook3.jpg"]
    }
  ]
};

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const url2 = "https://your-image-url.com"; // URL giả lập hình ảnh

  useEffect(() => {
    console.log("Product ID from URL:", id);
    if (id) {
      const foundProduct = fakedata.product_slug.find((p) => p.slug === id);
      console.log("Found Product:", foundProduct);
      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.images[0]);
      } else {
        console.log("Sản phẩm không tồn tại.");
        setProduct(null);
      }
    }
  }, [id]);


  // Kiểm tra nếu không có sản phẩm thì render thông báo sản phẩm không tồn tại
  if (!product) return <div>Sản phẩm không tồn tại</div>;

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleQuantityChange = (event) => {
    let newQuantity = event.target.value;
    if (newQuantity === "" || isNaN(newQuantity)) {
      setQuantity("");
    } else {
      newQuantity = parseInt(newQuantity, 10);
      if (newQuantity >= 1 && newQuantity <= product.quantity) {
        setQuantity(newQuantity);
      }
    }
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
    setSelectedThumbnail(image);
  };

  const togglePopup = () => setShowPopup(!showPopup);

  const handleAddQuantityToCart = () => {
    toast.success("Thêm vào giỏ hàng");
  };

  return (
    <div className="product-info-tab-container">
      <div className="productinfo-container">
        <div className="productinfo-images">
          <div className="productinfo-main-image">
            {/* Kiểm tra nếu mainImage tồn tại mới hiển thị ảnh */}
            {mainImage && <img src={`${url2}/images/${mainImage}`} alt={product.nameProduct} />}
            <div className="productinfo-zoom-icon" onClick={togglePopup}>
              <FaSearch size={22} color="black" />
            </div>
          </div>
          <div className="productinfo-thumbnail-images">
            {product.images && product.images.map((image, index) => (
              <img
                key={index}
                src={`${url2}/images/${image}`}
                alt={`Thumbnail ${index + 1}`}
                className={`productinfo-thumbnail ${selectedThumbnail === image ? "selected" : ""}`}
                onClick={() => handleThumbnailClick(image)}
              />
            ))}
          </div>
        </div>

        <div className="productinfo-details">
          <h1 className="productinfo-name">{product.nameProduct}</h1>
          <p className="productinfo-price">{product.price ? `${product.price.toLocaleString()}đ` : "LIÊN HỆ VỚI SHOP"}</p>

          <div className="productinfo-quantity">
            <label htmlFor="quantity">Số lượng:</label>
            <div className="quantity-control">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</button>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.quantity}
                step="1"
              />
              <button type="button" onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))} disabled={quantity >= product.quantity}>+</button>
            </div>
          </div>

          <button className="productinfo-buy-now" onClick={handleAddQuantityToCart}>
            <FaShoppingCart className="productinfo-icon" /> MUA NGAY
          </button>

          <div className="productinfo-actions">
            <button className="productinfo-contact" onClick={() => navigate("/lien-he")}>
              <FaEnvelope className="productinfo-icon-contact" /> LIÊN HỆ
            </button>
            <button className="productinfo-addCart" onClick={handleAddQuantityToCart}>
              <FaCartPlus className="productinfo-icon-addCart" /> Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
      {/* ProductTab Section */}
      <div className="product-tab-container">
        <div className="tab-header">
          <button
            className={`tab-button ${activeTab === "description" ? "active" : ""}`}
            onClick={() => handleTabClick("description")}
          >
            Mô tả
          </button>
          <button
            className={`tab-button ${activeTab === "specification" ? "active" : ""}`}
            onClick={() => handleTabClick("specification")}
          >
            Thông số kỹ thuật
          </button>
        </div>

        <div className="product-tab-content">
          {activeTab === "description" && product && (
            <div className="description-section">
              <h1 className="producttab-title">{product.nameProduct}</h1>
              <div className="producttab-images">
                {product.images?.[0] && (
                  <img
                    src={`${url2}/images/${product.images[0]}`}
                    alt="Hình ảnh sản phẩm"
                    className="producttab-image"
                  />
                )}
              </div>

              <h2>I. Thông tin sản phẩm</h2>
              <p className="producttab-description">{product.recap}</p>

              <h2>II. Ưu điểm sản phẩm</h2>
              <div className="producttab-images">
                {product.images?.[1] && (
                  <img
                    src={`${url2}/images/${product.images[1]}`}
                    alt="Hình ảnh sản phẩm"
                    className="producttab-image"
                  />
                )}
              </div>
              <p className="producttab-description">{product.description}</p>
              <div className="producttab-images">
                {product.images?.[2] && (
                  <img
                    src={`${url2}/images/${product.images[2]}`}
                    alt="Hình ảnh sản phẩm"
                    className="producttab-image"
                  />
                )}
              </div>

              <h2>III. Ứng dụng</h2>
              <p className="producttab-description">{product.description}</p>
            </div>
          )}

          {activeTab === "specification" && product && (
            <div className="specification-section">
              <h2 className="specification-title">Thông số kỹ thuật</h2>
              <ul className="specification-list">
                <li className="spec-item">
                  <span className="spec-label">Bo mạch chủ:</span>
                  <span className="spec-value">{product.mainBoard}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">Chip:</span>
                  <span className="spec-value">{product.chip}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">CPU:</span>
                  <span className="spec-value">{product.cpu}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">GPU:</span>
                  <span className="spec-value">{product.gpu}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">RAM:</span>
                  <span className="spec-value">{product.ram}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">Bộ nhớ:</span>
                  <span className="spec-value">{product.memory}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">Phiên bản:</span>
                  <span className="spec-value">{product.version}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">Cổng kết nối:</span>
                  <span className="spec-value">{product.ports}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">Kích thước màn hình:</span>
                  <span className="spec-value">{product.displaySize}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">Mật độ điểm ảnh:</span>
                  <span className="spec-value">{product.pixelDensity}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">Màn hình:</span>
                  <span className="spec-value">{product.display}</span>
                </li>
                <li className="spec-item">
                  <span className="spec-label">Tần số quét:</span>
                  <span className="spec-value">{product.refreshRate}</span>
                </li>
              </ul>
            </div>
          )}


        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay" onClick={togglePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img src={`${url2}/images/${mainImage}`} alt={product.nameProduct} className="popup-image-vanh" />
            <button className="popup-close" onClick={togglePopup}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
