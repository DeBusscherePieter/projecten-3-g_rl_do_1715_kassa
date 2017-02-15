var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.maaltijden = {};

    $http.get('https://hogent.herokuapp.com/maaltijdList').success(function(response){
        $scope.maaltijden = response;
        console.log($scope.maaltijden)
    });

    $scope.userList = [];

    $scope.addMaaltijd = function(title,key) {
      $scope.userList.push({titel: title, sleutel: key});
    };

}]);