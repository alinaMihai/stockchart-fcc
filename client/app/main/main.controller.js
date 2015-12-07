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
          vm.addStock = addStock;
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
              socket.syncUpdates('stock', vm.stocks, function(event, stock, stocks) {
                  console.log(stocks);
                  if (event === 'deleted') {
                      handleDelete(stock);
                  }
                  if (event === 'created') {
                      handleAdd(stock);
                  }
              });
              $scope.$on('$destroy', function() {
                  socket.unsyncUpdates('stock');
              });
              StockService.getStocks().then(function(data) {
                  var stocks = data[0];
                  var serverStocks = data[1];
                  stocks.forEach(function(stock, index) {
                      if (stock) {
                          var organization = stock.dataset.name.split('(')[0];
                          serverStocks[index].organization = organization;
                          vm.chartConfig.series.push({
                              id: stock.dataset.dataset_code,
                              name: organization,
                              data: processStockData(stock.dataset.data)
                          });
                      }
                      vm.stocks.push(serverStocks[index]);

                  });
              });
          }

          function deleteStock(stock) {
              StockService.deleteStock(stock.name).then(function() {});
          }

          function addStock() {
              StockService.addStock({
                  name: vm.newStock
              }).then(function() {
                  vm.newStock = "";
              });
          }

          function handleDelete(stock) {
              var stockCode = stock.name;
              vm.chartConfig.series.forEach(function(series, index) {
                  if (series.id.toLowerCase() === stockCode) {
                      vm.chartConfig.series.splice(index, 1);
                  }
              });
          }

          function handleAdd(serverStock) {

              StockService.getStockData(serverStock.name).then(function(stock) {
                  if (stock) {
                      var organization = stock.dataset.name.split('(')[0];
                      serverStock.organization = organization;
                      vm.chartConfig.series.push({
                          id: stock.dataset.dataset_code,
                          name: organization,
                          data: processStockData(stock.dataset.data)
                      });
                  }

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