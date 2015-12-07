'use strict';

var app = angular.module('stockchartApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'btford.socket-io',
        'ui.router',
        'highcharts-ng',
        'angularSpinner'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(true);
    });

app.value('moment', moment);
app.value('Highcharts', Highcharts);
app.constant('toastr', toastr);
app.constant('_', window._);
app.config(toastrConfig);
toastrConfig.$inject = ['toastr'];
/* @ngInject */
function toastrConfig(toastr) {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-top-right';
}