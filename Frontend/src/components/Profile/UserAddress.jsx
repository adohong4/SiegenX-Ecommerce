import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddressPopup from '../Popup/AddressPopup';
import { StoreContext } from '../../context/StoreContext';

const UserAddress = () => {
    const { url, fetchUserAddress, address } = useContext(StoreContext)
    axios.defaults.withCredentials = true;
    const [showAddressPopup, setShowAddressPopup] = useState(false);

    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await axios.delete(`${url}/v1/api/profile/address/delete/${addressId}`);
            toast.success(response.data.message);
            fetchUserAddress();
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    useEffect(() => {
        fetchUserAddress();
    }, []);

    return (
        <div className="my-address">
            <div className='container'>
                <div className='title-address'>
                    <h2 className="border-bt col-6">Địa chỉ của tôi</h2>
                    <button type="button" className="btn-add-address col-3" onClick={() => setShowAddressPopup(true)}>
                        + Thêm đia chỉ
                    </button>
                </div>

                <div className="address-list">
                    {address.map((address, index) => {
                        return (
                            <div key={index} className="my-address-addresses">
                                {/* <img src={assets.parcel_icon} alt="" className="address-icon" /> */}
                                <div className="address-details">
                                    <div className='Address'>
                                        <div className="address-details-body">
                                            <div className="address-details-left">
                                                <div>
                                                    <p>{address.fullname}</p>
                                                    <p>{address.phone}</p>
                                                </div>
                                                <p>{address.street}, {address.precinct}, {address.city}, {address.province}</p>
                                            </div>
                                            <div className="address-details-right">
                                                <button onClick={() => handleDeleteAddress(address._id)}>Xóa</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* AddressPopup */}
                {showAddressPopup && (
                    <AddressPopup
                        setShowAddress={setShowAddressPopup}
                        onSuccess={fetchUserAddress}
                    />
                )}
            </div>
        </div>
    )
}

export default UserAddress
