angular
    .module('cloudDecor.validators.resetParse', [])
    .directive('resetParse', resetParse);

function resetParse() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attributes, ngModelCtrl) {
        
            if (!ngModelCtrl) {
                return;
            }

            var value;
            var form_name = attributes.form_name || "pd_form";
            var alias = attributes.alias || "journalist";



            ngModelCtrl.$parsers.push(function (val) {
                value = val;

                if (scope[alias][form_name].$submitted) {
                    var field = attributes.name;
                    var is_user_error = attributes.resetParse;


                    scope[alias][form_name][field].$setValidity('parse', true, ngModelCtrl);

                    if (scope[alias].errors && is_user_error) {
                        scope[alias].errors[is_user_error] = null;
                    }
                }
                return value;
            });
        }
    };
}
