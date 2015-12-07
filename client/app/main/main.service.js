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

        ////////////////

        function getStockData(stockName) {
            var deferred = $q.defer();
            var endDate = moment().format('YYYY-MM-DD');
            var startDate = moment().subtract(365, 'd').format('YYYY-MM-DD');
            $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stockName + '.json?api_key=' + quandlApiKey +
                '&order=asc&start_date=' + startDate + '&end_date=' + endDate).then(function(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

        function getStocks() {
            var promises = [];
            var deferred = $q.defer();
            return getServerSideStocks().then(function(stocks) {
                stocks.forEach(function(stock) {
                    promises.push(getStockData(stock.name));
                });
                $q.all(promises).then(function(stocks) {
                    console.log(stocks);
                    deferred.resolve(stocks);
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