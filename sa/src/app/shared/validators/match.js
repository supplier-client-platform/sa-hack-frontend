/**
* @desc this directive is for matching two values
* @example <input match="[ng-model to which needs to be compared to]"></input>
*/
angular
    .module('cloudDecor.validators.match',[])
    .directive('match', match);

function match($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {        
                return $parse(attrs.match)(scope) === ctrl.$modelValue;
            }, function(validity) {
                ctrl.$setValidity('match', validity);
            });
        }
    };
}
