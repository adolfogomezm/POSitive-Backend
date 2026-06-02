const express = require('express');
const router = express.Router();

const syncRouter = require('./productsSync');
const getRouter = require('./productsGet');

router.use(syncRouter);
router.use(getRouter);

module.exports = router;
