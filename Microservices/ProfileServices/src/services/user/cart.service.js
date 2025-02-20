'use strict'

const userCart = require('../../models/profile.model')
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../../core/error.response")

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
            throw error
        }
    }

    static getCart = async (userId) => {
        try {
            let user = await userCart.findById(userId)

            return {
                cart: user.cartData
            }
        } catch (error) {
            throw error
        }
    }

    static addQuantityToCart = async (userId, itemId, quantity) => {
        try {
            let user = await userCart.findById(userId)
            let cartData = await user.cartData;

            if (quantity < 0) {
                throw new BadRequestError('Quantity must be greater than 0')
            }

            if (!cartData[itemId]) {
                cartData[itemId] = quantity;
            } else {
                cartData[itemId] += quantity;
            }

            const updatedCart = await userCart.findByIdAndUpdate(userId, { cartData })
            return {
                cart: updatedCart.cartData
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    static removeFromCart = async (userId, itemId) => {
        try {
            let user = await userCart.findById(userId)
            let cartData = await user.cartData;
            if (cartData[itemId] > 0) {
                cartData[itemId] -= 1;
            }
            const updatedCart = await userCart.findByIdAndUpdate(userId, { cartData })
            return {
                cart: updatedCart.cartData
            }
        } catch (error) {
            throw new Error(error)
        }
    }

}

module.exports = UserCartService;
