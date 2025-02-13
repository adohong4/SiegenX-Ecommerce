'use strict'

const userCart = require('../models/profile.model')

class UserCartService {

    static addToCart = async (userId, itemId) => {
        try {
            let user = await userCart.findById(userId)
            let cartData = await user.cartData;
            if (!cartData[itemId]) {
                cartData[itemId] = 1;
            } else {
                cartData[itemId] += 1;
            }
            const updatedCart = await userCart.findByIdAndUpdate(userId, { cartData })
            return {
                cart: updatedCart.cartData
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    static getCart = async (userId) => {
        try {
            let user = await userCart.findById(userId)

            return {
                cart: user.cartData
            }
        } catch (error) {
            throw new Error(error)
        }
    }

}

module.exports = UserCartService;
