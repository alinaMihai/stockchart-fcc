'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Stock', StockSchema);