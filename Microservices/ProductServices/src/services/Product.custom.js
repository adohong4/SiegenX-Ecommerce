'use strict';

const productModel = require('../models/product.model');
const fs = require('fs')
const path = require('path');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const natural = require('natural');
const { TfIdf } = natural;

class ProductCustomeService {
    static ContentBasedFiltering = async (req, res) => {
        try {
            const { productIds, numRecommendations = 4 } = req.body;

            if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
                throw new BadRequestError('productIds must be a non-empty array');
            }

            const allRecommendations = [];

            for (const productId of productIds) {
                const currentProduct = await productModel.findById(productId);
                if (!currentProduct) {
                    console.warn(`Product not found: ${productId}`);
                    continue;
                }

                const currentProductVector = await ProductCustomeService.vectorizeProduct(currentProduct);
                // Sử dụng projection ở đây
                const allProducts = await productModel.find(
                    { _id: { $nin: productIds }, active: true },
                    { title: 1, nameProduct: 1, product_slug: 1, price: 1, images: 1, category: 1, _id: 1 } // Projection
                );

                const similarities = [];
                for (const product of allProducts) {
                    // Không cần vectorize lại nếu chỉ dùng để so sánh với currentProductVector
                    const productVector = await ProductCustomeService.vectorizeProduct(product); // Vẫn cần vectorize đủ thông tin cho currentProduct
                    const similarity = ProductCustomeService.cosineSimilarity(currentProductVector, productVector);
                    similarities.push({ product, similarity });
                }
                similarities.sort((a, b) => b.similarity - a.similarity);
                allRecommendations.push(...similarities.slice(0, numRecommendations).map(item => item.product));
            }

            // Loại bỏ trùng lặp (sử dụng JSON.stringify vì không có _id)
            const uniqueRecommendations = Array.from(new Set(allRecommendations.map(p => JSON.stringify(p)))).map(p => JSON.parse(p));

            return { // Thêm res.status(200)
                metadata: uniqueRecommendations.slice(0, numRecommendations),
            };

        } catch (error) {
            throw error;
        };
    }


    // Hàm vectorizeProduct (Helper function - nên là private)
    static async vectorizeProduct(product) {
        const tfidf = new TfIdf();
        const document = ProductCustomeService.preprocessText(`${product.title} ${product.nameProduct} ${product.recap} ${product.description} ${product.category} ${product.chip} ${product.cpu} ${product.gpu} ${product.ram} ${product.memory} ${product.version} ${product.display}`);
        tfidf.addDocument(document);

        const vector = [];
        tfidf.listTerms(0).forEach(function (item) {
            vector.push(item.tfidf);
        });

        return vector;
    }

    // Hàm cosineSimilarity (Helper function - nên là private)
    static cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += (vecA[i] || 0) * (vecB[i] || 0);
            normA += (vecA[i] || 0) ** 2;
            normB += (vecB[i] || 0) ** 2;
        }

        if (normA === 0 || normB === 0) {
            return 0;
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // Hàm preprocessText (Helper function - nên là private)
    static preprocessText(text) {
        text = text.toLowerCase();
        text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

        // Loại bỏ stop words tiếng Việt (ví dụ đơn giản)
        const stopWords = ["và", "hoặc", "là", "của", "các", "có", "trong", "được", "bị", "một", "những"]; // Thêm stop words
        const words = text.split(" ");
        const filteredWords = words.filter(word => !stopWords.includes(word));
        text = filteredWords.join(" ");

        return text;
    }
}

module.exports = ProductCustomeService;