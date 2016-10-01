angular.module('cloudDecor.validators.integer', [])
    .directive('integerVal', integerVal);

function integerVal() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val) || val === null) {
                    val = '';
                }

                var clean = val.toString().replace(/[^0-9]/g, '');

                if (clean !== val) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }

                return clean;
            });
        }
    };
}


