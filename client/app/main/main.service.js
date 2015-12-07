(function() {
    'use strict';

    angular
        .module('stockchartApp')
        .service('StockService', StockService);

    StockService.$inject = ['$http', '$q', 'quandlApiKey', 'moment'];

    /* @ngInject */
    function StockService($http, $q, quandlApiKey, moment) {
        this.getStocks = getStocks;
        this.deleteStock = deleteStock;
        this.addStock = addStock;
        this.getStockData = getStockData;

        ////////////////

        function getStockData(stockName) {
            var deferred = $q.defer();
            var endDate = moment().format('YYYY-MM-DD');
            var startDate = moment().subtract(365, 'd').format('YYYY-MM-DD');
            $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stockName + '.json?api_key=' + quandlApiKey +
                '&order=asc&start_date=' + startDate + '&end_date=' + endDate)
                .success(function(stock) {
                    deferred.resolve(stock);
                })
                .error(function(err) {
                    deferred.resolve(undefined);
                });
            return deferred.promise;
        }

        function getStocks() {
            var promises = [];
            var deferred = $q.defer();
            return getServerSideStocks().then(function(stocks) {
                var serverStocks = stocks;
                stocks.forEach(function(stock) {
                    promises.push(getStockData(stock.name));
                });
                $q.all(promises).then(function(stocks) {
                    console.log(stocks);
                    deferred.resolve([stocks, serverStocks]);
                });
                return deferred.promise;
            });
        }

        function deleteStock(name) {
            var deferred = $q.defer();
            $http.delete('/api/stocks/' + name)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function addStock(stock) {
            var deferred = $q.defer();
            $http.post('/api/stocks/', stock)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(err) {
                    console.log(err);
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getServerSideStocks() {
            var deferred = $q.defer();
            $http.get('/api/stocks')
                .success(function(stocks) {
                    console.log(stocks);
                    deferred.resolve(stocks);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

    }
})();