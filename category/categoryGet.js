const isAuthorized = require("../utils/isAuth");
const pool = require("../db/pool");
const express = require('express');
const router = express.Router();

router.get("/api/category", async (req, res) => {
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT idCategory, name FROM category"
        );

        const categorys = rows.map((row) => ({
            idCategory: row.idCategory,
            name: row.name
        }));

        return res.json({ ok: true, categorys });
    } catch (error) {
        console.error("Fetch categorys error:", error);
        return res.status(500).json({ error: "fetch_failed", details: error.message });
    }
});

module.exports = router;