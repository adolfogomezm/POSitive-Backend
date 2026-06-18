const isAuthorized = require("../utils/isAuth");
const pool = require("../db/pool");
const express = require("express");
const router = express.Router();

router.get("/api/inventory", async (req, res) => {
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try {
        const [rows] = await pool.query(
            `SELECT 
                p.name AS product_name,
                i.date AS purchase_date,
                i.unitaryPrice AS unitary_price,
                i.quantity AS quantity
             FROM product p
             JOIN inventory i ON p.inventory_id = i.id`
        );

        const inventory = rows.map((row) => ({
            productName: row.product_name,
            purchaseDate: row.purchase_date,
            unitaryPrice: row.unitary_price,
            quantity: row.quantity
        }));

        return res.json({ ok: true, inventory });
    } catch (error) {
        console.error("Fetch inventory error:", error);
        return res.status(500).json({ error: "fetch_failed" });
    }
});

module.exports = router;
