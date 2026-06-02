const isAuthorized = require("../utils/isAuth");
const express = require('express');
const router = express.Router();
const pool = require("../db/pool");

router.post("/api/category", async (req, res) => {
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: "unauthorized" });
    }

    const { categorys } = req.body || {};
    if (!Array.isArray(categorys)) {
        return res.status(400).json({ error: "categorys must be an array" });
    }

    for (const category of categorys) {
        if (
            category == null ||
            category.name == null
        ) {
            return res.status(400).json({
                error: "each category requieres a non-empty name",
            });
        }

    }

    try {
        const result = await applyCategorys(categorys);
        return res.json({ ok: true, ...result });
    } catch (error) {
        console.error("Database sync error:", error.message);
        return res.status(500).json({ error: "sync_failed", details: error.message });
    }
});

async function applyCategorys(categorys) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    let idCreatedCategorys = [];
    try {
        for (const category of categorys) {
            let [rows] = await connection.query("SELECT idCategory FROM category WHERE name = ?", [category.name]);
            if (rows.length === 0) {
                const [result] = await connection.query("INSERT INTO category (name) VALUES (?)", [category.name]);
                idCreatedCategorys.push(result.insertId);
            } else {
                idCreatedCategorys.push(rows[0].idCategory);
            }
        }
        await connection.commit();
        return { ok: true, idCreatedCategorys };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = router;