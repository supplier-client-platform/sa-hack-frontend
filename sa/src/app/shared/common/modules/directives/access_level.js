angular
    .module('cloudDecor.directive.access-level', [])
    .directive('accessLevel', accessLevel);

function accessLevel(userService) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var accessLevel;
            attrs.$observe('accessLevel', function (acl) {
                if (acl) {
                    accessLevel = acl;
                    updateCss();
                }
            });

            function updateCss() {
                if (accessLevel) {
                    if (!userService.isAuthorized(accessLevel)) {
                        switch (element[0].nodeName) {
                            case "A":
                                element.children().remove();
                                element.remove();
                                break;

                            case "INPUT":
                            case "BUTTON":
                                element.children().remove();
                                element.remove();
                                break;

                            default:
                                element.attr("disabled", "disabled");
                                break;
                        }
                    }
                }
            }
        }
    };
}