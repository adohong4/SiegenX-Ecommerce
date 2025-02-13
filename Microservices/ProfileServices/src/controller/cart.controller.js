'use strict'

const cartService = require('../services/cart.service')

class CartController {
    addToCart = async (req, res) => {
        try {
            const { userId } = req.user._id
            const { itemId } = req.body
            const cart = await cartService.addToCart(userId, itemId)
            res.status(200).json(cart)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new CartController();