  (function() {
      'use strict';

      angular
          .module('stockchartApp')
          .controller('MainCtrl', MainCtrl);

      MainCtrl.$inject = ['$scope', 'socket', 'StockService'];

      /* @ngInject */
      function MainCtrl($scope, socket, StockService) {
          var vm = this;
          vm.stocks = [];
          vm.deleteStock = deleteStock;
          vm.chartConfig = {
              options: {
                  rangeSelector: {
                      enabled: false
                  },
                  tooltip: {
                      style: {
                          padding: 10,
                          fontWeight: 'bold'
                      }
                  },
                  animation: true,
                  legend: {
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
              StockService.getStocks().then(function(stocks) {
                  stocks.forEach(function(stock) {
                      var organization = stock.dataset.name.split('(')[0];
                      vm.stocks.push([organization, stock.dataset.dataset_code]);
                      vm.chartConfig.series.push({
                          id: stock.dataset.dataset_code,
                          name: organization,
                          data: processStockData(stock.dataset.data)
                      });
                  });
              });
          }

          function deleteStock(stock) {
              StockService.deleteStock(stock[1].toLowerCase()).then(function() {

              });
          }

          function processStockData(stockData) {
              var values = [];
              stockData.forEach(function(item, i) {
                  values[i] = [];
                  values[i].push(Date.parse(item[0]));
                  values[i].push(item[4]);
              });
              return values;
          }
      }
  })();