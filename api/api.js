const express = require('express');
const router = express.Router();

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const newsRouter = require('../routes/news');

// ***********************
// Handling the API Routes
// ***********************

router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/news', newsRouter);

module.exports = router;