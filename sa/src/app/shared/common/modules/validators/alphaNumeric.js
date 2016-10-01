/**
* @desc alpha numeric Val directive is to validate alphaneumeric values provided with the UI
* @example <input alpha-numeric-val="DOT, SINGLE-QUOTE, SLASH"></input>
*/

angular.module('cloudDecor.validators.alphaNumeric', [])
    .directive('alphaNumericVal', alphaNumericVal);

function alphaNumericVal($global) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            
            var REGEX_STRING = '';
            var valid_characters = attrs.alphaNumericVal;
            
            angular.forEach($global.CHARACTERS, function (character, label) {
                if ( valid_characters.indexOf(label) > -1 ){
                    REGEX_STRING = REGEX_STRING + character;
                }
            });
            
            REGEX_STRING = new RegExp('[^a-zA-Z0-9' + REGEX_STRING + ']');
            
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    val = '';
                }

                var clean = val.replace(REGEX_STRING, '');

                if (clean !== val) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }

                return clean;
            });
        }
    };
}
