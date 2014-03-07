'use strict';
/* Controllers */
/* 
 * Author: Aaron Bazzone 1/23/14
 * Description: AngularJS demo using E*Trade rest API's
 */

newsApp.controller('newsController', ['$scope', '$sce', '$http',
    function newsController($scope, $sce, $http) {
        
        $scope.symbolValidation = function() {
            var stockSymbol = $scope.ticker;

        $scope.companyName = $scope.headlines = $scope.newsArticle = "";

            $http.get('https://api.etrade.com/v1/market/quote/' + stockSymbol + '.json').then(function(results) {
                //console.log($scope.newsHeadline);

                var res = results.data.QuoteResponse;

                if (res.Messages && res.Messages.Message[0].type === "ERROR") {
                    $scope.companyName = $sce.trustAsHtml("Stock symbol not found.");
                }
                else {
                    // DIRECTIVE EXAMPLE - $scope.stockCoName = res.QuoteData[0].All.companyName;
                    $scope.companyName = $sce.trustAsHtml("Company News: " + res.QuoteData[0].All.companyName + ".");
                    $scope.getNewsHeadlines(stockSymbol);
                }
            }, function(err) {
                $scope.newsHeadline = "Stock symbol not found.";
                console.log(err);
            });
        };

        $scope.getNewsHeadlines = function(ticker) {
            $http.get('https://api.etrade.com/v1/market/news/MarketWatch?symbol=' + ticker + '&overrideProvider=false.json').then(function(results) {
                var res = results.data.NewsResponse;
                console.log(res);
                angular.forEach(res.News, function(item, iter) {
                    //console.log(res.News[key].headline);
                    var h_line = item.headline;
                    res.News[iter].headline = h_line.split(':')[2] || h_line.split(':')[1] || h_line;
                });

                $scope.headlines = res.News;
                
                //select first headline to show article
                $scope.setSelected(res.News[0]);
                $scope.getArticle(res.News[0].storyDetail);
            });
        };

        $scope.getArticle = function(link) {
            //console.log(link);
            $http.get(link).then(function(result) {
                var res = result.data.NewsResponse;
                //console.log(res.News[0].companyNews)
                $scope.newsArticle = $sce.trustAsHtml(res.News[0].companyNews);
            });
        };

        $scope.setSelected = function(headline) {
            console.log(headline);
            $scope.active = headline;
        };


        // **************** Functions for typeahead widget
        $scope.matchSymbols = function(query, callback) {
            //console.log('in matchSymbols: ' + $http);
            return $http.get('https://api.etrade.com/v1/market/lookup/' + query).then(function(res) {
                var symbols = [];
                //console.log(res);
                angular.forEach(res.data.LookupResponse.Data, function(item) {
                    symbols.push(item);
                });
                return symbols;
            });
        };
        $scope.getTicker = function(item) {
            //console.log(item);
            $scope.ticker = item.symbol;
        };
        
        //default values when page loads
        $scope.ticker = 'ETFC';
        $scope.symbolValidation('ETFC');
        $scope.ticker = '';
        $scope.placeholder = 'ETFC';
    }]);
