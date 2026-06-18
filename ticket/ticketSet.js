const isAuthorized = require("../utils/isAuth");
const pool = require("../db/pool");
const express = require('express');
const router = express.Router();


router.post("/api/tickets", async (req, res) => {
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: "unauthorized" });
    }

    const { idTicketLocal, finalPrice, created_at, updated_at, products } = req.body;

    if (!idTicketLocal || !products || !Array.isArray(products)) {
        return res.status(400).json({ error: "invalid_payload" });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [ticketResult] = await connection.query(
            `INSERT INTO ticket (idTicketLocal, finalPrice, created_at, updated_at) 
             VALUES (UNHEX(?), ?, ?, ?)`,
            [
                idTicketLocal,
                finalPrice,
                created_at ? new Date(created_at) : new Date(),
                updated_at ? new Date(updated_at) : null
            ]
        );

        const idTicket = ticketResult.insertId;

        for (const prod of products) {
            const [productRows] = await connection.query(
                `SELECT idProduct, idCategory FROM product WHERE IdProductLocal = UNHEX(?)`,
                [prod.IdProductLocal]
            );

            if (productRows.length === 0) {
                throw new Error(`Product not found in database: ${prod.IdProductLocal}`);
            }

            const { idProduct, idCategory } = productRows[0];

            await connection.query(
                `INSERT INTO product_has_ticket (idProduct, idCategory, idTicket, quantity, unitaryPrice) 
                 VALUES (?, ?, ?, ?, ?)`,
                [idProduct, idCategory, idTicket, prod.quantity, prod.unitaryPrice]
            );
        }

        await connection.commit();

        return res.json({
            ok: true,
            message: "Ticket and products saved successfully",
            idTicket
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Set ticket error:", error);
        return res.status(500).json({ error: "set_ticket_failed", details: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;