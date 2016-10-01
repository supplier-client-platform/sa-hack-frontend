
/**
* @desc tab change directive is to change tab index upon a seperate event(button) click
* @example <button tab-change tabs="[number of tabs]"></button>
*/

angular
    .module('cloudDecor.directive.tab-change', [])
    .directive('tabChange', tabChange);

function tabChange($location, $anchorScroll) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {

            function init() {
                var alias = attributes.alias || "vm";
                var lastTabIndex = attributes.tabs ? attributes.tabs - 1 : null;
                if (lastTabIndex) {
                    scope[alias].selectedIndex = (scope[alias].selectedIndex === lastTabIndex) ? 0 : scope[alias].selectedIndex + 1;
                }



                if ($location.hash() !== "form-tab") {
                    $location.hash("form-tab");
                } else {
                    $anchorScroll();
                }

            }

            element.on('click', init);
        }
    };
}