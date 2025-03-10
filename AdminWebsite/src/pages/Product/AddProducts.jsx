
import React, { useState, useContext } from 'react';
import '../styles/styles.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { Tab, Tabs } from 'react-bootstrap';

const AddProduct = () => {
    const { url } = useContext(StoreContext);
    const [images, setImage] = useState([]);
    const [data, setData] = useState({
        title: "",
        nameProduct: "",
        price: "",
        recap: "",
        description: "",
        category: "Màn hình LED",
        quantity: "",
        mainBoard: "",
        chip: "",
        cpu: "",
        gpu: "",
        ram: "",
        memory: "",
        version: "",
        ports: "",
        displaySize: "",
        pixelDensity: "",
        display: "",
        refreshRate: "",
    });
    const [loading, setLoading] = useState(false);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("nameProduct", data.nameProduct);
        formData.append("description", data.description);
        formData.append("recap", data.recap);
        formData.append("price", Number(data.price));
        formData.append("quantity", Number(data.quantity));
        formData.append("category", data.category);
        Array.from(images).forEach(image => formData.append("images", image));
        formData.append("mainBoard", data.mainBoard);
        formData.append("chip", data.chip);
        formData.append("cpu", data.cpu);
        formData.append("gpu", data.gpu);
        formData.append("ram", data.ram);
        formData.append("memory", data.memory);
        formData.append("version", data.version);
        formData.append("ports", data.ports);
        formData.append("displaySize", data.displaySize);
        formData.append("pixelDensity", data.pixelDensity);
        formData.append("display", data.display);
        formData.append("refreshRate", data.refreshRate);

        try {
            console.log("data: ", formData)
            const response = await axios.post(`${url}/v1/api/product/add`, formData);
            if (response.data.status) {
                setData({
                    title: "",
                    nameProduct: "",
                    price: "",
                    recap: "",
                    description: "",
                    category: "Màn hình LED",
                    quantity: "",
                    mainBoard: "",
                    chip: "",
                    cpu: "",
                    gpu: "",
                    ram: "",
                    memory: "",
                    version: "",
                    ports: "",
                    displaySize: "",
                    pixelDensity: "",
                    display: "",
                    refreshRate: "",
                });
                setImage(false);
                toast.success("Thêm sản phẩm thành công");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add d-flex align-items-center justify-content-center add-tab" style={{ minHeight: '100vh' }}>
            <div className=" addprd card p-5 shadow-lg border-0" style={{ width: '90vw', borderRadius: '15px', height: '100%' }}>
                <form onSubmit={onSubmitHandler}>
                    <div className='add-body-product'>
                        <div className='tab-left col-8'>

                            <Tabs defaultActiveKey="general" id="product-tabs" >
                                <Tab eventKey="general" title="Thông Tin Sản Phẩm">
                                    <div className="form-group text-center" style={{ display: "flex", gap: "10px", alignItems: "center" }}                                    >
                                        <p className="font-weight-bold mb-1">Thêm ảnh sản phẩm</p>
                                        <label htmlFor="images" style={{ cursor: 'pointer' }}>
                                            <div className="upload-preview-container">
                                                {images.length > 0 ? (
                                                    images.map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={URL.createObjectURL(img)}
                                                            alt={`Upload Preview ${index + 1}`}
                                                            className=" shadow-sm"

                                                        />
                                                    ))
                                                ) : (
                                                    <img
                                                        src={assets.download_img}
                                                        alt="Upload Preview"
                                                        className=" shadow-sm"

                                                    />
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            onChange={(e) => setImage([...e.target.files])}
                                            type="file"
                                            id="images"
                                            className="d-none"
                                            multiple
                                            required
                                        />

                                    </div>
                                    <div className='form-row'>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="title" className="mb-2">Tiêu đề (*)</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.title}
                                                type="text"
                                                name="title"
                                                id="title"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập tiêu đề sản phẩm"
                                                required
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="nameProduct" className="mb-2">Tên Sản Phẩm (*)</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.nameProduct}
                                                type="text"
                                                name="nameProduct"
                                                id="nameProduct"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập tên sản phẩm"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="category" className="mb-2">Danh mục (*)</label>
                                            <select
                                                onChange={onChangeHandler}
                                                value={data.category}
                                                name="category"
                                                id="category"
                                                className="form-control rounded-pill"
                                            >
                                                <option value="Màn hình LED">Màn hình LED</option>
                                                <option value="MH tương tác">MH tương tác</option>
                                                <option value="MH quảng cáo LCD">MH quảng cáo LCD</option>
                                                <option value="Quảng cáo 3D (OOH)">Quảng cáo 3D (OOH)</option>
                                                <option value="KTV 5D">KTV 5D</option>
                                            </select>
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="price" className="mb-2">Giá (VNđ) (*)</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.price}
                                                type="number"
                                                name="price"
                                                id="price"
                                                className="form-control rounded-pill"
                                                placeholder="20"
                                                required
                                            />
                                        </div>

                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="quantity" className="mb-2">Số lượng (*)</label>
                                        <input
                                            onChange={onChangeHandler}
                                            value={data.quantity}
                                            type="number"
                                            name="quantity"
                                            id="quantity"
                                            className="form-control rounded-pill"
                                            placeholder="20"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="recap" className="mb-2">Miêu tả ngắn (*)</label>
                                        <textarea
                                            onChange={onChangeHandler}
                                            value={data.recap}
                                            type="text"
                                            name="recap"
                                            id="recap"
                                            rows="4"
                                            className="form-control"
                                            placeholder="Nhập miêu tả sản phẩm"
                                            style={{ borderRadius: '15px' }}
                                        ></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="mb-2">Miêu tả sản phẩm (*)</label>
                                        <textarea
                                            onChange={onChangeHandler}
                                            value={data.description}
                                            name="description"
                                            id="description"
                                            rows="4"
                                            className="form-control"
                                            placeholder="Miêu tả sản phẩm"
                                            style={{ borderRadius: '15px' }}
                                        ></textarea>
                                    </div>


                                </Tab>


                                {/* Tab 2 */}
                                <Tab eventKey="specifications" title="Thông Số Kỹ Thuật">
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="mainBoard" className="mb-2">Thông Số Bo Mạch Chủ</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.mainBoard}
                                                type="text"
                                                name="mainBoard"
                                                id="mainBoard"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập Thông Số Bo Mạch Chủ"
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="chip" className="mb-2">Chip</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.chip}
                                                type="text"
                                                name="chip"
                                                id="chip"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập loại chip"
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="gpu" className="mb-2">GPU</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.gpu}
                                                type="text"
                                                name="gpu"
                                                id="gpu"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập GPU"
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="cpu" className="mb-2">CPU</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.cpu}
                                                type="text"
                                                name="cpu"
                                                id="cpu"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập CPU"
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="ram" className="mb-2">RAM</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.ram}
                                                type="text"
                                                name="ram"
                                                id="ram"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập RAM"
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="memory" className="mb-2">Bộ nhớ</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.memory}
                                                type="text"
                                                name="memory"
                                                id="memory"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập Dung lượng bộ nhớ (HDD/SSD)"
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="version" className="mb-2">Phiên bản</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.version}
                                                type="text"
                                                name="version"
                                                id="version"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập phiên bản"
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="displaySize" className="mb-2">Kích Thước Hiển Thị</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.displaySize}
                                                type="text"
                                                name="displaySize"
                                                id="displaySize"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập Thông số màn hình (IPS, OLED, v.v.)"
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="pixelDensity" className="mb-2">Độ Phân Giải</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.pixelDensity}
                                                type="text"
                                                name="pixelDensity"
                                                id="pixelDensity"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập Port"
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="ports" className="mb-2">Cổng</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.ports}
                                                type="text"
                                                name="ports"
                                                id="ports"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập pixelDensity"
                                            />
                                        </div>
                                        {/* Weight */}
                                        <div className="form-group col-md-6">
                                            <label htmlFor="display" className="mb-2">Màn Hình</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.display}
                                                type="text"
                                                name="display"
                                                id="display"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập màn hình"
                                            />
                                        </div>

                                        {/* Battery */}
                                        <div className="form-group col-md-6">
                                            <label htmlFor="refreshRate" className="mb-2">refreshRate</label>
                                            <input
                                                onChange={onChangeHandler}
                                                value={data.refreshRate}
                                                type="text"
                                                name="refreshRate"
                                                id="refreshRate"
                                                className="form-control rounded-pill"
                                                placeholder="Nhập tần số quét"
                                            />
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>

                        </div>
                        <div className='tab-right col-2'>
                            <div className='tab-right-content'>
                                <img src={assets.add_product} alt="add products" />
                                <div className="text-center mt-4">
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 py-2" disabled={loading}>
                                        {loading ? "Đang tải..." : "Thêm Sản Phẩm"}
                                    </button>
                                </div>
                                <div className="text-center mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-pill px-4 py-2"
                                        disabled={loading}
                                        style={{ background: "red" }}  // Đúng: Dùng object
                                    >
                                        {loading ? "Đang tải..." : "Làm mới"}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
