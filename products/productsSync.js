const isAuthorized = require("../utils/isAuth");
const applyIncomingProducts = require("./applyIncomingProducts");
const express = require('express');
const router = express.Router();

router.post("/api/products/sync", async (req, res) => {
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: "unauthorized" });
    }

    const { products } = req.body || {};
    if (!Array.isArray(products)) {
        return res.status(400).json({ error: "products must be an array" });
    }

    const normalizedProducts = [];
    for (const product of products) {
        if (
            product == null ||
            product.idProductLocal == null ||
            product.idCategory == null ||
            product.name == null ||
            product.quantity == null ||
            product.price == null ||
            product.sync == null
        ) {
            return res.status(400).json({
                error:
                    "each product requires idProductLocal, idCategory, name, quantity, price, sync",
            });
        }

        if (
            typeof product.idProductLocal !== "string" ||
            product.idProductLocal.length !== 32 ||
            !/^[0-9a-fA-F]+$/.test(product.idProductLocal)
        ) {
            return res.status(400).json({
                error: "idProductLocal must be a 32-char hex string",
            });
        }

        if (
            typeof product.idCategory !== "number" ||
            !Number.isInteger(product.idCategory) ||
            product.idCategory < 1
        ) {
            return res.status(400).json({
                error: "idCategory must be a positive integer",
            });
        }

        if (
            typeof product.name !== "string" ||
            product.name.trim().length === 0
        ) {
            return res.status(400).json({
                error: "name must be a non-empty string",
            });
        }

        if (
            typeof product.quantity !== "number" ||
            !Number.isInteger(product.quantity) ||
            product.quantity < 0
        ) {
            return res.status(400).json({
                error: "quantity must be a non-negative integer",
            });
        }

        if (
            typeof product.price !== "number" ||
            product.price < 0
        ) {
            return res.status(400).json({
                error: "price must be a non-negative number",
            });
        }

        if (
            typeof product.sync !== "number" ||
            !Number.isInteger(product.sync) ||
            product.sync < 0 ||
            product.sync > 1
        ) {
            return res.status(400).json({
                error: "sync must be 0 or 1",
            });
        }

        const localIdBuffer = Buffer.from(product.idProductLocal, "hex");
        if (localIdBuffer.length !== 16) {
            return res.status(400).json({
                error: "idProductLocal must decode to 16 bytes",
            });
        }

        normalizedProducts.push({
            ...product,
            localIdBuffer,
        });
    }

    try {
        const result = await applyIncomingProducts(normalizedProducts);
        return res.json({ ok: true, ...result });
    } catch (error) {
        console.error("Database sync error:", error.message);
        return res.status(500).json({ error: "sync_failed", details: error.message });
    }
});

module.exports = router;