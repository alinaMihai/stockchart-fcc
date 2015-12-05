(function() {
    'use strict';

    angular
        .module('stockchartApp')
        .service('StockService', StockService);

    StockService.$inject = ['$http', '$q', 'quandlApiKey', 'moment'];

    /* @ngInject */
    function StockService($http, $q, quandlApiKey, moment) {
        this.getStockData = getStockData;

        ////////////////

        function getStockData(stockName) {
            var deferred = $q.defer();
            var endDate = moment().format('YYYY-MM-DD');
            var startDate = moment().subtract(7, 'd').format('YYYY-MM-DD');
            $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + stockName + '.json?api_key=' + quandlApiKey +
                '&order=asc&start_date=' + startDate + '&end_date=' + endDate).then(function(response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }

    }
})();