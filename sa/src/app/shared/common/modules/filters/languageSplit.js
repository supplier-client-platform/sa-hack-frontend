/**
 * This filter remove country code from language code
 */
angular
    .module('cloudDecor.filters.language_split', [])
    .filter('languageSplit', languageSplit);

function languageSplit() {
    return function(input) {
        if (
            angular.isDefined(input) &&
            input !== null &&
            input !== '' &&
            input.search('-') !== -1
        ) {
            return input.split('-')[0];
        } else {
            return input;
        }
    };
}
