const express = require('express');
const router = express.Router();

const categoryGetRouter = require('./categoryGet');
const categoryPostRouter = require('./categoryPost');

router.use(categoryGetRouter);
router.use(categoryPostRouter);

module.exports = router;
