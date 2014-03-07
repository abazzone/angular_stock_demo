'use strict';
/* 
 * Author: Aaron Bazzone 1/23/14
 * Description: AngularJS demo using E*Trade rest API's
 */
var newsApp = angular.module('newsApp', [
    'ngSanitize',
    'ui.bootstrap',
    'ngRoute'])
        .config(function($routeProvider) {
            $routeProvider
                    .when('/', {
                        templateUrl: 'templates/news_view.html',
                        controller: 'newsController'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
        })
        .config(["$httpProvider", function(provider) {
                provider.defaults.headers.get = {'ConsumerKey': '4bfbff438e3a35641b33643118cb6242'};
                provider.interceptors.push(function($q) {
                    return {
                        'request': function(config) {
                            return config || $q.when(config);
                        },
                        'responseError': function(rejection) {
                            console.log('Ajax failed you reject');
                            return $q.reject(rejection);
                        }
                    };
                });
            }]);