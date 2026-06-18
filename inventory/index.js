const express = require('express');
const inventoryGetRouter = require('./inventoryGet');

const router = express.Router();

router.use(inventoryGetRouter);

module.exports = router;
