  (function() {
      'use strict';

      angular
          .module('stockchartApp')
          .controller('MainCtrl', MainCtrl);

      MainCtrl.$inject = ['$scope', 'socket', 'StockService'];

      /* @ngInject */
      function MainCtrl($scope, socket, StockService) {
          var vm = this;
          var stockSuggest = ["goog", "fb", "ea", "aapl", "amzn", "jd", "ebay", "tcehy", "baba", "expe", "nflx", "bidu", "yhoo", "grpn", "lnkd", "twtr"];
          vm.chartConfig = {
              options: {
                  chart: {
                      zoomType: 'x'
                  },
                  rangeSelector: {
                      enabled: true
                  },
                  navigator: {
                      enabled: true
                  }
              },
              series: [],
              title: {
                  text: 'Stock Market'
              },
              useHighStocks: true
          }


          activate();

          ////////////////

          function activate() {
              StockService.getStockData(stockSuggest[1]).then(function(data) {
                  console.log(data);
                  $scope.chartConfig.series.push({
                      id: 1,
                      data: data
                  });
              });
          }


      }
  })();