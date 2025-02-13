'use strict'

const cartService = require('../services/cart.service')
const { OK } = require('../utils/statusCodes')

class CartController {
    addToCart = async (req, res, next) => {
        try {
            const userId = req.user._id
            const { itemId } = req.body
            const result = await cartService.addToCart(userId, itemId)
            new CREATED({
                message: 'Thêm vào giỏ hàng thành công',
                metadata: result.cart
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    addQuantityToCart = async (req, res, next) => {
        try {
            const userId = req.user._id
            const { itemId, quantity } = req.body
            const result = await cartService.addQuantityToCart(userId, itemId, quantity)
            new CREATED({
                message: 'Thêm vào giỏ hàng thành công',
                metadata: result.cart
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    getCart = async (req, res, next) => {
        try {
            const userId = req.user._id
            const cart = await cartService.getCart(userId)
            new OK({
                message: 'Lấy giỏ hàng',
                metadata: cart.cart
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    removeFromCart = async (req, res, next) => {
        try {
            const userId = req.user._id
            const { itemId } = req.body
            const cart = await cartService.removeFromCart(userId, itemId)
            new OK({
                message: 'Xoa thanh cong',
                metadata: cart.cart
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new CartController();