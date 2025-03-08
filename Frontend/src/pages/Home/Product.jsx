import React, { useState, useContext, useEffect } from "react";
import { StoreContext } from '../../context/StoreContext'
import { useNavigate, useSearchParams } from "react-router-dom";
import { assets } from '../../assets/assets';
import { formatCurrency } from '../../lib/utils'
import { columns, columns_Rep } from '../../data/data'
import '../styles/styles.css';

const Products = () => {
    const { product_list, url, url2, product_campaign } = useContext(StoreContext);
    const [searchParams] = useSearchParams(); // Lấy các tham số từ URL
    const [selectedCategory, setSelectedCategory] = useState(null); // Category được chọn
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9; // Số sản phẩm mỗi trang
    const navigate = useNavigate();

    console.log(product_campaign)

    // Lấy category từ URL
    useEffect(() => {
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl); // Cập nhật selectedCategory khi category thay đổi trong URL
        } else {
            setSelectedCategory(null);
        }
    }, [searchParams]);

    // Lọc sản phẩm theo category
    const filteredProducts = selectedCategory
        ? product_campaign?.updatedProducts.filter((product) => product.category === selectedCategory)
        : product_campaign?.updatedProducts;

    const totalPages = Math.ceil(filteredProducts?.length / productsPerPage);
    const currentProducts = filteredProducts?.slice(
        (currentPage - 1) * productsPerPage, // (thứ tự trang hiện tại - 1) * số lượng sp có thể hiển thị trên 1 trang( 9sp )
        currentPage * productsPerPage // trang hiện tại * 9 
        // kết quả vidu: (0,9), (9,18), (18, 27)
    );

    const emptyProducts = new Array(productsPerPage - currentProducts?.length).fill(null); // Placeholder nếu ít sản phẩm hơn

    // Xử lý khi click vào sản phẩm
    const handleProductClick = (productSlug) => {
        navigate(`/san-pham/${productSlug}`);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(totalPages, currentPage + 1);

            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) pages.push("...");
            }

            for (let i = startPage; i <= endPage; i++) pages.push(i);

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Xử lý khi click vào category từ BannerHome
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        navigate(`/san-pham?category=${category}`); // Chuyển đến URL với category
    };

    return (
        <main>
            <div className='container-home'>
                <div className='banner-main'>
                    <img src={assets.bannerproduct} alt="" />
                </div>
                <div className="products-list">
                    <div className="container">
                        {/* List Category */}
                        <div className="menu-container">
                            <div className="menu-columns">
                                {columns.map((column, index) => (
                                    <div
                                        key={index}
                                        className="menu-column"
                                        onClick={() => handleCategoryClick(column.category)} // Chuyển category khi click
                                    >
                                        <div className="menu-title">{column.title}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="menu-columns-rep">
                                {columns_Rep.map((column, index) => (
                                    <div
                                        key={index}
                                        className="menu-column"
                                        onClick={() => handleCategoryClick(column.category)} // Chuyển category khi click
                                    >
                                        <div className="menu-title">{column.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h2 className="section-title">
                            {selectedCategory ? `Danh mục: ${selectedCategory}` : "Tất cả sản phẩm"}
                        </h2>

                        <div className="products-content ">
                            <div className="productlist-banner col-4">
                                <img src={assets.Banner} alt="" />
                            </div>

                            {filteredProducts.length === 0 ? (
                                <p>Không có sản phẩm nào trong danh mục này!</p>
                            ) : (
                                <div className="productlist-grid col-8">
                                    {currentProducts.map((product) => ( // duyệt qua các sản phẩm được hiển thị trong 1 page vidu: (0,9), (9,18), (18, 27)
                                        <div
                                            className="productlist-card"
                                            key={product.product_slug}
                                            onClick={() => handleProductClick(product.product_slug)}
                                        >
                                            <div className="productlist-img-container">
                                                {product_campaign?.campaignType === 'percentage' && product.newPrice !== null && (
                                                    <div className="discount-badge">
                                                        -{product_campaign.campaignValue}%
                                                    </div>
                                                )}
                                                <img src={`http://localhost:9003/images/${product.images[0]}`} alt=""
                                                    className="productlist-image"
                                                />
                                                <div className="cart-icon">
                                                    <i className="fas fa-shopping-cart"></i>
                                                </div>
                                            </div>
                                            <h3 className="productlist-title">{product.nameProduct}</h3>
                                            <div className="product-price-container">
                                                {product.newPrice !== null ? (
                                                    <>
                                                        <span className="product-new-price">{formatCurrency(product.newPrice)}đ</span>
                                                        <span className="product-old-price">{formatCurrency(product.price)}đ</span>
                                                    </>
                                                ) : (
                                                    <span className="product-price">{formatCurrency(product.price)}đ</span>
                                                )}
                                            </div>
                                            <div className="productlist-actions">
                                                <button
                                                    className="productlist-price-btn"
                                                    onClick={(e) => navigate("/lien-he")}
                                                >
                                                    LIÊN HỆ
                                                </button>
                                                <button
                                                    className="productlist-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleProductClick(product.product_slug);
                                                    }}
                                                >
                                                    XEM NGAY
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add empty placeholders to fill the grid */}
                                    {emptyProducts.map((_, index) => (
                                        <div className="productlist-card empty" key={index}></div>
                                    ))}
                                </div>
                            )}

                        </div>

                        {filteredProducts.length > 0 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>

                                {generatePageNumbers().map((page, index) => (
                                    <button
                                        key={index}
                                        className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                                        onClick={() => typeof page === "number" && handlePageChange(page)}
                                        disabled={page === "..."}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                        <div className="productlist-banner-foot">
                            <img src={assets.bannerProductList} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Products;