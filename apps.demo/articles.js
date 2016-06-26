var myApp = angular.module('articlesApp', ['ngStamplay']);

myApp.controller('ArticleListController', function($scope,$stamplay){
    $scope.articles = [];
    $stamplay.Object('articles')
        .get()
        .then(function(result){
            $scope.articles = result.data;
        });
});