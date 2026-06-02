const pool = require("../db/pool");

async function applyIncomingProducts(products) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        for (const product of products) {
            const [rows] = await connection.query(
                "SELECT * FROM product WHERE idProductLocal = ?",
                [product.localIdBuffer]
            );
            if (rows.length === 0) {
                await connection.query(
                    "INSERT INTO product (idProductLocal, name, quantity, price, sync, idCategory) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        product.localIdBuffer,
                        product.name,
                        product.quantity,
                        product.price,
                        product.sync,
                        product.idCategory,
                    ]
                );
            } else {
                await connection.query(
                    "UPDATE product SET name = ?, quantity = ?, price = ?, sync = ?, updated_at = ?, idCategory = ? WHERE idProductLocal = ?",
                    [
                        product.name,
                        product.quantity,
                        product.price,
                        1,
                        new Date().toISOString().slice(0, 19).replace('T', ' '),
                        product.idCategory,
                        product.localIdBuffer,
                    ]
                );
            }

        }
        await connection.commit();
        return { ok: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = applyIncomingProducts;