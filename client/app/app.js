'use strict';

var app = angular.module('stockchartApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'btford.socket-io',
        'ui.router',
        'highcharts-ng'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(true);
    });

app.value('moment', moment);
app.value('Highcharts', Highcharts);