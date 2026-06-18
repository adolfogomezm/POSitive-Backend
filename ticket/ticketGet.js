const isAuthorized = require("../utils/isAuth");
const pool = require("../db/pool");
const express = require('express');
const router = express.Router();

router.get("/api/tickets", async (req, res) => {
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: "unauthorized" });
    }

    try {
        const ticketsWithProducts = [];

        const [rowsTickets] = await pool.query(
            "SELECT * FROM ticket"
        );

        for (const ticket of rowsTickets) {
            const [rowsProducts] = await pool.query(
                `SELECT 
                    p.IdProductLocal,
                    p.name AS productName,
                    pht.quantity,
                    pht.unitaryPrice,
                    (pht.quantity * pht.unitaryPrice) AS total,
                    c.name AS categoryName
                 FROM 
                    product_has_ticket pht
                 JOIN 
                    product p ON pht.idProduct = p.idProduct
                 JOIN 
                    category c ON p.idCategory = c.idCategory
                 WHERE 
                    pht.idTicket = ?`,
                [ticket.idTicket]
            );

            const formattedProducts = rowsProducts.map(product => {
                return {
                    ...product,
                    IdProductLocal: product.IdProductLocal ? product.IdProductLocal.toString("hex") : null
                };
            });

            ticketsWithProducts.push({
                idTicketLocal: ticket.idTicketLocal ? ticket.idTicketLocal.toString("hex") : null,
                date: ticket.date,
                finalPrice: ticket.finalPrice,
                created_at: ticket.created_at,
                updated_at: ticket.updated_at,
                products: formattedProducts
            });
        }

        return res.json({ ok: true, tickets: ticketsWithProducts });
    } catch (error) {
        console.error("Fetch tickets error:", error);
        return res.status(500).json({ error: "fetch_failed", details: error.message });
    }
});

module.exports = router;