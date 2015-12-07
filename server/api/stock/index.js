'use strict';

var express = require('express');
var controller = require('./stock.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:name', controller.destroy);

module.exports = router;