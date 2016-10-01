angular
    .module('cloudDecor.validators.resetParse',[])
    .directive('resetParse', resetParse);

function resetParse() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attributes, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            var value;

            ngModelCtrl.$parsers.push(function(val) {
                value = val;

                if (scope.vm.cd_form.$submitted) {
                    var field = attributes.name;
                    var is_user_error = attributes.resetParse;
                    
                    scope.vm.cd_form[field].$setValidity('parse', true);

                    if (scope.vm.errors && is_user_error) {
                        scope.vm.errors[is_user_error] = null;
                    }
                }

                return value;
            });
        }
    };
}
