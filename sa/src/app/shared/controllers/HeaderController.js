
angular.module('sa-hack.controllers.HeaderController', [])
    .controller('HeaderController', HeaderController);

function HeaderController($scope){
    $scope.title = "SA";
}