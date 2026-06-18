require("dotenv").config();

const express = require("express");
const productsRouter = require("./products");
const categoryRouter = require("./category");
const ticketRouter = require("./ticket");
const inventoryRouter = require("./inventory");

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(productsRouter);
app.use(categoryRouter);
app.use(ticketRouter);
app.use(inventoryRouter);

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

const apiPort = Number(process.env.API_PORT || 3000);
app.listen(apiPort, () => {
    console.log(`Sync API listening on http://localhost:${apiPort}`);
});





