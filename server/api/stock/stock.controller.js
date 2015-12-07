/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /stocks              ->  index
 * POST    /stocks              ->  create
 * DELETE  /stocks/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Stock = require('./stock.model');

// Get list of stocks
exports.index = function(req, res) {
    Stock.find(function(err, stocks) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(stocks);
    });
};

// Creates a new stock in the DB.
exports.create = function(req, res) {
    var existsAlready = Stock.findOne({
        name: req.body.name
    }).exec(function(err, stock) {
        if (!stock) {
            Stock.create(req.body, function(err, stock) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(201).json(stock);
            });
        } else {
            return res.status(500).send("Stock already exists");
        }
    });


};

// Deletes a stock from the DB.
exports.destroy = function(req, res) {
    var query = Stock.findOne({});
    query.where('name', req.params.name);
    query.exec(function(err, stock) {
        if (err) {
            return handleError(res, err);
        }
        if (!stock) {
            return res.status(404).send('Not Found');
        }
        stock.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}