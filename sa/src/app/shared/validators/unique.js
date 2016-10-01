/**
* @desc this directive is for check the uniqueness against given array of ng-model values
* @example <input unique-email="ng-model1, ng-model2...."></input>
*/

angular
    .module('cloudDecor.validators.unique',[])
    .directive('unique', unique);

function unique() {
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

                if (attributes.unique && ngModelCtrl) {
                    ngModelCtrl.$setValidity('isUniqueEmail', isValid());
                }

                return value;
            });
            
            function isValid() {
                var valid = true;
                var array = attributes.unique.replace(/[\s]+/g, '').split(',');
                
                angular.forEach(array, function(emailField){
                    var emailValue = $("input[name="+ emailField +"]").val();
                    var validity = getValidity(emailValue, emailField);
                    setField(emailField, validity);
                    valid = valid && validity;
                    
                    angular.forEach(array, function(field){
                        if (emailField !== field) {
                            var isValid = (($("input[name="+ field +"]").val() ) !== emailValue);

                            if (!isValid) {
                                setField(emailField, isValid);
                                setField(field, isValid);
                            }
                        }
                    });
                });

                return valid;
            }
            
            function getValidity(emailValue) {
                return (value !== emailValue);
            }
            
            function setField(emailField, validity) {
                scope.vm.cd_form[emailField].$setValidity('isUniqueEmail', validity);
            }
            
        }
    };
}