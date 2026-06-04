const express = require('express');
const router = express.Router();

const ticketGetRouter = require('./ticketGet');
const ticketSetRouter = require('./ticketSet');

router.use(ticketGetRouter);
router.use(ticketSetRouter);

module.exports = router;
