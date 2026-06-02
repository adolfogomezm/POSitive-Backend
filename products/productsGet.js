const isAuthorized = require("../utils/isAuth");
const pool = require("../db/pool");
const express = require('express');
const router = express.Router();

router.get("/api/products", async (req, res) => {
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT IdProductLocal, name, quantity, price, updated_at, idCategory FROM product"
        );

        const products = rows.map((row) => ({
            idProductLocal: row.IdProductLocal ? row.IdProductLocal.toString("hex") : null,
            name: row.name,
            quantity: row.quantity,
            price: row.price,
            sync: 1,
            updated_at: row.updated_at,
            idCategory: row.idCategory,
        }));

        return res.json({ ok: true, products });
    } catch (error) {
        console.error("Fetch products error:", error);
        return res.status(500).json({ error: "fetch_failed" });
    }
});

module.exports = router;