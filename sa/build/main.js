(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

require('./shared/common');
require('./shared');




require('./modules/demo/demo.routing');
require('./modules/products/product');

/**
 * ENV
 */
var $global = require('./shared/utils/constants.js');
var $message = require('./shared/utils/messages.js');


var app = angular
    .module('sa-hack', [

        'clouddecor.common',
        'sa-hack.shared',
       
        //------------- Node modules ------------//
        'ui.router',
        'ngMaterial',
        'ngMessages',
        'ngCookies',
        'pageslide-directive',
        'anim-in-out',
        'ui.select',
        'ngSanitize',
        'toastr',
        'vAccordion',
        'ngAnimate',
        'checklist-model',
        'angular-loading-bar',
        'sn.skrollr',
        'jkAngularCarousel',
        'checklist-model',
        'rzModule',
        'ngMaterialDatePicker',

//--app modules--//
        'sa-hack.demo',
        'sa-hack.products'
    ]);
app.
    config(["$urlRouterProvider", "$stateProvider", "snSkrollrProvider", "toastrConfig", "cfpLoadingBarProvider", configFunction])
    .constant("$global", $global)
    .constant("$message", $message)
    .run(run);

function configFunction($urlRouterProvider, $stateProvider, snSkrollrProvider, toastrConfig, cfpLoadingBarProvider) {
    $urlRouterProvider.otherwise("/");
    // cfpLoadingBarProvider.includeSpinner = false;


    //Main Routing
    $stateProvider
        .state('default', {
            abstract: true,
            views: {
                layout: {
                    templateUrl: 'app/shared/views/default-layout.html'
                }
            }
        });

    snSkrollrProvider.config = { smoothScrolling: true };

    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-full-width',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body',
        closeButton: true
    });
}



function run(
    $rootScope,
    $http,
    $cookies,
    toastr,
    snSkrollr,
    $state,
    CommonService
) {


    CommonService.log("app Works");
    
    $state.go('default.demo');


}

},{"./modules/demo/demo.routing":3,"./modules/products/product":4,"./shared":25,"./shared/common":6,"./shared/utils/constants.js":29,"./shared/utils/messages.js":30}],2:[function(require,module,exports){
angular.module('sa-hack.demo.demoController', [])
    .controller('DemoController', DemoController);


function DemoController(CommonService) {
    CommonService.log("demo works");
}

},{}],3:[function(require,module,exports){

require('./controllers/demoController');

angular.module('sa-hack.demo', ['sa-hack.demo.demoController'])
    .config(config);


function config($stateProvider) {
    //Routing
    $stateProvider
        .state('default.demo', {
            abstract: false,
            url: "demo",
            views: {
                content: {
                    templateUrl: 'app/modules/demo/views/demo.html',
                    controller: 'DemoController as vm'
                }
            }
        });
}


},{"./controllers/demoController":2}],4:[function(require,module,exports){

angular.module('sa-hack.products', [])
    .config(config)
    .controller('ProductController',ProductController);


function config($stateProvider) {
    //Routing
    $stateProvider
        .state('default.products', {
            abstract: false,
            url: null,
            views: {
                content: {
                    templateUrl: 'app/modules/products/product.html',
                    controller: 'ProductController as vm'
                }
            }
        });
}


function ProductController(){
    console.log("sadsa");
}

},{}],5:[function(require,module,exports){

require('./modules/validators');
require('./modules/directives');
require('./modules/filters');

(function () {
    "use strict";
    angular.module('clouddecor.common', ['clouddecor.validators', 'clouddecor.filters' ,'clouddecor.directives']);
})();
},{"./modules/directives":9,"./modules/filters":13,"./modules/validators":17}],6:[function(require,module,exports){
 
//  load common modules
require('./clouddecor-common');

// Export namespace
module.exports = 'clouddecor.common';
},{"./clouddecor-common":5}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
/**
* @desc this directive is for check the difference of two elements and apply a css class to show the difference
* @example <input diff="user.name"></input>
*/

angular
    .module('cloudDecor.directive.diff',[])
    .directive('diff', diff);

function diff() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attributes, ngModelCtrl) {
             
            if(scope.vm.editedView){
                var array = attributes.diff.split('.');
            
                var new_val = scope.vm.newVersion;
                var old_val = scope.vm.oldVersion;
                
                angular.forEach(array, function (i) {
                    new_val = new_val[i];
                    old_val = old_val[i];
                });
                
                if(!angular.equals(new_val, old_val)){
                    element.addClass('diff');
                }  
            }    
        }
    };
}
},{}],9:[function(require,module,exports){
require('./access_level');
require('./diff'); 
require('./sticky');
require('./tab-change');
 
(function () {
    "use strict";
    angular.module('clouddecor.directives', [
        'cloudDecor.directive.access-level',
        'cloudDecor.directive.diff', 
        'cloudDecor.directive.tab-change' 
    ]);
})();


},{"./access_level":7,"./diff":8,"./sticky":10,"./tab-change":11}],10:[function(require,module,exports){
(function (namespace) {
    // set sticky module and directive
    angular.module(namespace, []).directive(namespace, function () {
        return {
            link: function (scope, angularElement, attrs) {
                var
                // get element
                    element = angularElement[0],

                // get document
                    document = element.ownerDocument,

                // get window
                    window = document.defaultView,

                // get wrapper
                    wrapper = document.createElement('span'),

                // cache style
                    style = element.getAttribute('style'),

                // get options
                    bottom = parseFloat(attrs[namespace + 'Bottom']),
                    media = window.matchMedia(attrs[namespace + 'Media'] || 'all'),
                    top = parseFloat(attrs[namespace + 'Top']),

                // initialize states
                    activeBottom = false,
                    activeTop = false,
                    offset = {};

                // configure wrapper
                wrapper.className = 'is-' + namespace;

                // activate sticky
                function activate() {
                    // get element computed style
                    var
                        computedStyle = getComputedStyle(element),
                        position = activeTop ? 'top:' + top : 'bottom:' + bottom,
                        parentNode = element.parentNode,
                        nextSibling = element.nextSibling;

                    // replace element with wrapper containing element
                    wrapper.appendChild(element);

                    if (parentNode) {
                        parentNode.insertBefore(wrapper, nextSibling);
                    }

                    // style wrapper
                    wrapper.setAttribute('style', 'display:' + computedStyle.display + ';height:' + element.offsetHeight + 'px;margin:' + computedStyle.margin + ';width:' + element.offsetWidth + 'px');

                    // style element
                    element.setAttribute('style', 'left:' + offset.left + 'px;margin:0;position:fixed;transition:none;' + position + 'px;width:' + computedStyle.width);
                }

                // deactivate sticky
                function deactivate() {
                    var
                        parentNode = wrapper.parentNode,
                        nextSibling = wrapper.nextSibling;

                    // replace wrapper with element
                    parentNode.removeChild(wrapper);

                    parentNode.insertBefore(element, nextSibling);

                    // unstyle element
                    if (style === null) {
                        element.removeAttribute('style');
                    } else {
                        element.setAttribute('style', style);
                    }

                    // unstyle wrapper
                    wrapper.removeAttribute('style');

                    activeTop = activeBottom = false;
                }

                // window scroll listener
                function onscroll() {
                    // if activated
                    if (activeTop || activeBottom) {
                        // get wrapper offset
                        offset = wrapper.getBoundingClientRect();

                        activeBottom = !isNaN(bottom) && offset.top > window.innerHeight - bottom - wrapper.offsetHeight;
                        activeTop = !isNaN(top) && offset.top < top;

                        // deactivate if wrapper is inside range
                        if (!activeTop && !activeBottom) {
                            deactivate();
                        }
                    }
                    // if not activated
                    else if (media.matches) {
                        // get element offset
                        offset = element.getBoundingClientRect();

                        activeBottom = !isNaN(bottom) && offset.top > window.innerHeight - bottom - element.offsetHeight;
                        activeTop = !isNaN(top) && offset.top < top;

                        // activate if element is outside range
                        if (activeTop || activeBottom) {
                            activate();
                        }
                    }
                }

                // window resize listener
                function onresize() {
                    // conditionally deactivate sticky
                    if (activeTop || activeBottom) {
                        deactivate();
                    }

                    // re-initialize sticky
                    onscroll();
                }

                // destroy listener
                function ondestroy() {
                    onresize();

                    window.removeEventListener('scroll', onscroll);
                    window.removeEventListener('resize', onresize);
                }

                // bind listeners
                window.addEventListener('scroll', onscroll);
                window.addEventListener('resize', onresize);

                scope.$on('$destroy', ondestroy);

                // initialize sticky
                onscroll();
            }
        };
    });
})('sticky');
},{}],11:[function(require,module,exports){

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
},{}],12:[function(require,module,exports){
angular
    .module('cloudDecor.filters.capitalize', [])
    .filter('capitalize', capitalize);

function capitalize() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
}

},{}],13:[function(require,module,exports){
require('./capitalize');
require('./languageSplit');


(function () {
    "use strict";
    angular.module('clouddecor.filters', [
        'cloudDecor.filters.capitalize',
        'cloudDecor.filters.language_split'
    ]);
})();
},{"./capitalize":12,"./languageSplit":14}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
angular.module('cloudDecor.validators.email', [])
    .directive('emailVal', emailVal);

function emailVal() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            if (ctrl && ctrl.$validators.email) {
                var EMAIL_REGEXP = /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$/;

                // this will overwrite the default Angular email validator
                ctrl.$validators.email = function(modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
}

 
},{}],17:[function(require,module,exports){
require('./alphaNumeric');
require('./email');
require('./integer');
require('./match');
require('./number');
require('./resetParse');
require('./unique');

(function () {
    "use strict";
    angular.module('clouddecor.validators', [
        'cloudDecor.validators.alphaNumeric',
        'cloudDecor.validators.email',
        'cloudDecor.validators.integer',
        'cloudDecor.validators.match',
        'cloudDecor.validators.number',
        'cloudDecor.validators.resetParse',
        'cloudDecor.validators.unique'
    ]);
})();


},{"./alphaNumeric":15,"./email":16,"./integer":18,"./match":19,"./number":20,"./resetParse":21,"./unique":22}],18:[function(require,module,exports){
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



},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
angular.module('cloudDecor.validators.number', [])
    .directive('numberVal', numberVal);

function numberVal() {
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

                var clean = val.toString().replace(/[^0-9\.]/g, '');
                var decimalCheck = clean.split('.');

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0,2);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }

                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
}

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){


angular.module('sa-hack.controllers', []);

module.exports = 'sa-hack.controllers';
},{}],24:[function(require,module,exports){


angular.module('sa-hack.directives', []);

module.exports = 'sa-hack.directives';
},{}],25:[function(require,module,exports){
require('./controllers');
require('./directives');
require('./services');
require('./validators');

(function () {
    "use strict";
    angular.module('sa-hack.shared', ['sa-hack.validators', 'sa-hack.directives', 'sa-hack.services', 'sa-hack.controllers']);
})();

module.exports = 'sa-hack.shared';
},{"./controllers":23,"./directives":24,"./services":27,"./validators":31}],26:[function(require,module,exports){

angular.module('sa-hack.controllers.CommonService', [])
    .service('CommonService', CommonService);

function CommonService() {

    var vm = this;

    return {
        login: login,
        logout: logout,
        log: log
    };

    function login() {
        vm.log("login");
    }


    function logout() {
        vm.log("logout");
    }

    function log(str) {
        console.log(str);
    }


}



},{}],27:[function(require,module,exports){

require('./commonService');
require('./userService');

angular.module('sa-hack.services', ['sa-hack.controllers.CommonService','sa-hack.controllers.UserService']);

module.exports = 'sa-hack.services';
},{"./commonService":26,"./userService":28}],28:[function(require,module,exports){
angular.module('sa-hack.controllers.UserService', [])
    .service('UserService', UserService);

function UserService() {

    var vm = this;

    return {
        login: login,
        logout: logout,
        log: log
    };

    function login() {
        vm.log("login");
    }


    function logout() {
        vm.log("logout");
    }

    function log(str) {
        console.log(str);
    }


}
},{}],29:[function(require,module,exports){
var $global = {};

$global.SECTION = 'pressdecor';
$global.ITEMS_PER_PAGE = '20';

/**
 * HTTP response codes
 */
$global.HTTP200 = 200;
$global.HTTP201 = 201;
$global.HTTP204 = 204;
$global.HTTP400 = 400;
$global.HTTP401 = 401;
$global.HTTP403 = 403;
$global.HTTP404 = 404;
$global.HTTP422 = 422;
$global.HTTP500 = 500;

/**
 * Alert types
 */
$global.INFO = 'info';
$global.ERROR = 'error';
$global.SUCCESS = 'success';
$global.WARNING = 'warning';

/**************************** User *******************************************/


/**
 * Action types
 */
$global.ACTIONS = {
    ADD: 'add',
    EDIT: 'edit'
};

/**************************** Subscription ***********************************/

/**
 * solution types
 */
$global.SOLUTIONS = {
    CLOUDDECOR: 'clouddecor',
    MARKETPLACE: 'marketplace'
};

/**************************** Product ****************************************/
$global.COLOR_VARIANT = 'color';

$global.COLORS = [
    { 'code': 'ed8477', 'class': 'bg-1' },
    { 'code': 'd24036', 'class': 'bg-2' },
    { 'code': 'a52618', 'class': 'bg-3' },
    { 'code': 'c24b21', 'class': 'bg-4' },
    { 'code': '70201c', 'class': 'bg-5' },
    { 'code': 'fbf298', 'class': 'bg-6' },
    { 'code': 'fade4b', 'class': 'bg-7' },
    { 'code': 'f5bb41', 'class': 'bg-8' },
    { 'code': 'f2a53a', 'class': 'bg-9' },
    { 'code': 'ee792f', 'class': 'bg-10' },
    { 'code': 'c34c21', 'class': 'bg-11' },
    { 'code': 'f7cdf3', 'class': 'bg-12' },
    { 'code': 'a94c8a', 'class': 'bg-13' },
    { 'code': '6d2855', 'class': 'bg-14' },
    { 'code': '3d1623', 'class': 'bg-15' },
    { 'code': '502e15', 'class': 'bg-16' },
    { 'code': '605347', 'class': 'bg-17' },
    { 'code': 'd1f3b6', 'class': 'bg-18' },
    { 'code': 'cdf381', 'class': 'bg-19' },
    { 'code': '78c562', 'class': 'bg-20' },
    { 'code': '629055', 'class': 'bg-21' },
    { 'code': '2e5025', 'class': 'bg-22' },
    { 'code': '2e6767', 'class': 'bg-23' },
    { 'code': 'e1fbfe', 'class': 'bg-24' },
    { 'code': 'd0e8f2', 'class': 'bg-25' },
    { 'code': '5aa2b0', 'class': 'bg-26' },
    { 'code': '3d8ab2', 'class': 'bg-27' },
    { 'code': '293a4e', 'class': 'bg-28' },
    { 'code': '1e2d3d', 'class': 'bg-29' },
    { 'code': '131b26', 'class': 'bg-30' },
    { 'code': '12131a', 'class': 'bg-31' },
    { 'code': 'acacac', 'class': 'bg-32' }
];

$global.PRODUCT_SAVE = 'save';
$global.PRODUCT_SAVE_DRAFT = 'save_draft';
$global.PRODUCT_EDIT = 'edit';
$global.PRODUCT_EDIT_DRAFT = 'edit_draft';

$global.PRODUCT_IMAGE = 'image';
$global.PRODUCT_NOT_FOUND = 'PRD006';

/******** Special characters to set as alpha numeric values *************/
$global.CHARACTERS = {
    'UNDERSCORE': '_',
    'COMMA': ',',
    'SPACE': ' ',
    'DOT': '.',
    'SLASH': '/',
    'AMPERSAND': '&',
    'SINGLE-QUOTE': '\'',
    'QUOTE': '"',
    'ASTERISK': '*',
    'AT': '@',
    'PLUS': '+',
    'HASH': '#',
    'QUESTION-MARK': '?',
    'HYPHEN': '-'
};
module.exports = $global;
},{}],30:[function(require,module,exports){
var $message = {};


/**
 * Success messages
 */
$message.POST_ADDED_SUCCESS = 'Post added successfully';
$message.POST_UPDATED_SUCCESS = 'Post updated successfully';
$message.POST_DELETED_SUCCESS = 'Post deleted successfully';

$message.PRODUCT_ADDED_SUCCESS = 'Product has been added';
$message.PRODUCT_DRAFT_ADDED_SUCCESS = 'Product has been added as draft';
$message.PRODUCT_UPDATED_SUCCESS = 'Product has been updated';
$message.PRODUCT_DRAFT_UPDATED_SUCCESS = 'Product has been updated as draft';
$message.PRODUCT_NOT_UPDATED = 'Nothing for update';
$message.PRODUCT_NOT_FOUND_ERR = 'No Products found';
$message.PRODUCT_DOWNLOAD_MAIL_SUCCESS = "Mail Sent Successfully";
$message.PRODUCT_DOWNLOAD_ERROR = "Something went wrong. Please try again";
$message.PRODUCT_DOWNLOAD_IMAGE_EMPTY = "Atleast one image should be selected to download";
//retailer
$message.RETAILER_ADDED_SUCCESS = 'Retailer registered successfully';

//account 
$message.RETAILER_USER_ADDED_SUCCESS = 'Retailer user added successfully';
$message.RETAILER_USER_EDITED_SUCCESS = 'Retailer user updated successfully';
$message.RETAILER_EDITED_SUCCESS = 'Retailer updated successfully';
$message.ACCOUNT_IMAGE_UPLOAD_SUCCESS = "Retailer store image uploaded successfully";

//journalist
$message.JOURNALIST_USER_ADDED_SUCCESS = 'Journalist user added successfully';

//cso
$message.PRODUCT_ACCEPT_SUCCESS = 'Product Accepted Successfully';
$message.PRODUCT_REJECT_SUCCESS = 'Product Rejected Successfully';
$message.RETAILER_ACCEPT_SUCCESS = 'Retailer Accepted Successfully';
$message.RETAILER_REJECT_SUCCESS = 'Retailer Rejected Successfully';

//brand
$message.BRAND_ADD_SUCCESS = 'Brand added successfully.';
$message.BRAND_PROFILE_FETCH_ERROR = "Brand not found";


/**
 * Information messages
 */
$message.POST_LIST_EMPTY_INFO = 'Posts not found';
$message.FORM_INVALID = 'Please enter mandatory fields to proceed';

//account
$message.RETAILER_USER_FETCH_ERROR = 'Retailer users not found.';
$message.RETAILER_PROFILE_FETCH_ERROR = 'Retailer profile not found.';



/**
 * Error messages
 */
//PRODUCT_DETAIL_LEAD_FAIL
$message.HTTP500_ERROR = 'Some error has occurred. Please try again';
$message.MARKET_PLACE_LIST_ERROR = 'Market places not found';
$message.MARKET_PLACE_ATTRIBUTES_ERROR = 'Market places attributes not found';
$message.CATEGORY_FETCH_ERROR = 'Can not fetch the category';

$message.COUNTRY_FETCH_ERROR = 'Countries not found.';
$message.CITY_FETCH_ERROR = 'Cities not found.';
$message.ROLES_FETCH_ERROR = 'User roles not found.';

$message.PRODUCT_NOT_FOUND = 'All the products has loaded';
$message.PRODUCT404_ERROR = 'Sorry, the requested product is not available';

//Product Edit
$message.PRODUCT_DETAIL_LEAD_FAIL = 'Some error has occurred. Please try again';

//account
$message.ACCOUNT_IMAGE_UPLOAD_ERROR = "Retailer store image upload error";
$message.CURRENCY_LIST_FETCH_ERROR = "Cannot fetch currency list.";
$message.CURRENCY_FETCH_ERROR = "Cannot fetch currency code.";

//subscription
$message.SUBSCRIPTION_PLAN_FETCH_ERROR = 'Subscription plan not found.';

//cso
$message.PRODUCT_FETCH_ERROR = "Product not found.";

//retailer
$message.RETAILER_LIST_NOT_FOUND = "Retailer Requests loading error.";

//brand
$message.USER_ROLE_NOT_FOUND = 'User Role not found.';
$message.FORM_INVALID = 'Please fill mandotory fields to proceed';


//ACL
$message.UNATHORIZED = "You don't have  required permissions.";


module.exports = $message;
},{}],31:[function(require,module,exports){


angular.module('sa-hack.validators', []);

module.exports = 'sa-hack.validators';
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvbW9kdWxlcy9kZW1vL2NvbnRyb2xsZXJzL2RlbW9Db250cm9sbGVyLmpzIiwic3JjL2FwcC9tb2R1bGVzL2RlbW8vZGVtby5yb3V0aW5nLmpzIiwic3JjL2FwcC9tb2R1bGVzL3Byb2R1Y3RzL3Byb2R1Y3QuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vY2xvdWRkZWNvci1jb21tb24uanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vaW5kZXguanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy9kaXJlY3RpdmVzL2FjY2Vzc19sZXZlbC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL2RpcmVjdGl2ZXMvZGlmZi5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy9kaXJlY3RpdmVzL3N0aWNreS5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL2RpcmVjdGl2ZXMvdGFiLWNoYW5nZS5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL2ZpbHRlcnMvY2FwaXRhbGl6ZS5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL2ZpbHRlcnMvaW5kZXguanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy9maWx0ZXJzL2xhbmd1YWdlU3BsaXQuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy92YWxpZGF0b3JzL2FscGhhTnVtZXJpYy5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL3ZhbGlkYXRvcnMvZW1haWwuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy92YWxpZGF0b3JzL2luZGV4LmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvdmFsaWRhdG9ycy9pbnRlZ2VyLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvdmFsaWRhdG9ycy9tYXRjaC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL3ZhbGlkYXRvcnMvbnVtYmVyLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvdmFsaWRhdG9ycy9yZXNldFBhcnNlLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvdmFsaWRhdG9ycy91bmlxdWUuanMiLCJzcmMvYXBwL3NoYXJlZC9jb250cm9sbGVycy9pbmRleC5qcyIsInNyYy9hcHAvc2hhcmVkL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJzcmMvYXBwL3NoYXJlZC9pbmRleC5qcyIsInNyYy9hcHAvc2hhcmVkL3NlcnZpY2VzL2NvbW1vblNlcnZpY2UuanMiLCJzcmMvYXBwL3NoYXJlZC9zZXJ2aWNlcy9pbmRleC5qcyIsInNyYy9hcHAvc2hhcmVkL3NlcnZpY2VzL3VzZXJTZXJ2aWNlLmpzIiwic3JjL2FwcC9zaGFyZWQvdXRpbHMvY29uc3RhbnRzLmpzIiwic3JjL2FwcC9zaGFyZWQvdXRpbHMvbWVzc2FnZXMuanMiLCJzcmMvYXBwL3NoYXJlZC92YWxpZGF0b3JzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnJlcXVpcmUoJy4vc2hhcmVkL2NvbW1vbicpO1xucmVxdWlyZSgnLi9zaGFyZWQnKTtcblxuXG5cblxucmVxdWlyZSgnLi9tb2R1bGVzL2RlbW8vZGVtby5yb3V0aW5nJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvcHJvZHVjdHMvcHJvZHVjdCcpO1xuXG4vKipcbiAqIEVOVlxuICovXG52YXIgJGdsb2JhbCA9IHJlcXVpcmUoJy4vc2hhcmVkL3V0aWxzL2NvbnN0YW50cy5qcycpO1xudmFyICRtZXNzYWdlID0gcmVxdWlyZSgnLi9zaGFyZWQvdXRpbHMvbWVzc2FnZXMuanMnKTtcblxuXG52YXIgYXBwID0gYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NhLWhhY2snLCBbXG5cbiAgICAgICAgJ2Nsb3VkZGVjb3IuY29tbW9uJyxcbiAgICAgICAgJ3NhLWhhY2suc2hhcmVkJyxcbiAgICAgICBcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tIE5vZGUgbW9kdWxlcyAtLS0tLS0tLS0tLS0vL1xuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ25nTWF0ZXJpYWwnLFxuICAgICAgICAnbmdNZXNzYWdlcycsXG4gICAgICAgICduZ0Nvb2tpZXMnLFxuICAgICAgICAncGFnZXNsaWRlLWRpcmVjdGl2ZScsXG4gICAgICAgICdhbmltLWluLW91dCcsXG4gICAgICAgICd1aS5zZWxlY3QnLFxuICAgICAgICAnbmdTYW5pdGl6ZScsXG4gICAgICAgICd0b2FzdHInLFxuICAgICAgICAndkFjY29yZGlvbicsXG4gICAgICAgICduZ0FuaW1hdGUnLFxuICAgICAgICAnY2hlY2tsaXN0LW1vZGVsJyxcbiAgICAgICAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuICAgICAgICAnc24uc2tyb2xscicsXG4gICAgICAgICdqa0FuZ3VsYXJDYXJvdXNlbCcsXG4gICAgICAgICdjaGVja2xpc3QtbW9kZWwnLFxuICAgICAgICAncnpNb2R1bGUnLFxuICAgICAgICAnbmdNYXRlcmlhbERhdGVQaWNrZXInLFxuXG4vLy0tYXBwIG1vZHVsZXMtLS8vXG4gICAgICAgICdzYS1oYWNrLmRlbW8nLFxuICAgICAgICAnc2EtaGFjay5wcm9kdWN0cydcbiAgICBdKTtcbmFwcC5cbiAgICBjb25maWcoW1wiJHVybFJvdXRlclByb3ZpZGVyXCIsIFwiJHN0YXRlUHJvdmlkZXJcIiwgXCJzblNrcm9sbHJQcm92aWRlclwiLCBcInRvYXN0ckNvbmZpZ1wiLCBcImNmcExvYWRpbmdCYXJQcm92aWRlclwiLCBjb25maWdGdW5jdGlvbl0pXG4gICAgLmNvbnN0YW50KFwiJGdsb2JhbFwiLCAkZ2xvYmFsKVxuICAgIC5jb25zdGFudChcIiRtZXNzYWdlXCIsICRtZXNzYWdlKVxuICAgIC5ydW4ocnVuKTtcblxuZnVuY3Rpb24gY29uZmlnRnVuY3Rpb24oJHVybFJvdXRlclByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgc25Ta3JvbGxyUHJvdmlkZXIsIHRvYXN0ckNvbmZpZywgY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XG4gICAgLy8gY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2U7XG5cblxuICAgIC8vTWFpbiBSb3V0aW5nXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdkZWZhdWx0Jywge1xuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgIGxheW91dDoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvdmlld3MvZGVmYXVsdC1sYXlvdXQuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgc25Ta3JvbGxyUHJvdmlkZXIuY29uZmlnID0geyBzbW9vdGhTY3JvbGxpbmc6IHRydWUgfTtcblxuICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICBhdXRvRGlzbWlzczogZmFsc2UsXG4gICAgICAgIGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcbiAgICAgICAgbWF4T3BlbmVkOiAwLFxuICAgICAgICBuZXdlc3RPblRvcDogdHJ1ZSxcbiAgICAgICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LXRvcC1mdWxsLXdpZHRoJyxcbiAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgICAgY2xvc2VCdXR0b246IHRydWVcbiAgICB9KTtcbn1cblxuXG5cbmZ1bmN0aW9uIHJ1bihcbiAgICAkcm9vdFNjb3BlLFxuICAgICRodHRwLFxuICAgICRjb29raWVzLFxuICAgIHRvYXN0cixcbiAgICBzblNrcm9sbHIsXG4gICAgJHN0YXRlLFxuICAgIENvbW1vblNlcnZpY2Vcbikge1xuXG5cbiAgICBDb21tb25TZXJ2aWNlLmxvZyhcImFwcCBXb3Jrc1wiKTtcbiAgICBcbiAgICAkc3RhdGUuZ28oJ2RlZmF1bHQuZGVtbycpO1xuXG5cbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdzYS1oYWNrLmRlbW8uZGVtb0NvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignRGVtb0NvbnRyb2xsZXInLCBEZW1vQ29udHJvbGxlcik7XG5cblxuZnVuY3Rpb24gRGVtb0NvbnRyb2xsZXIoQ29tbW9uU2VydmljZSkge1xuICAgIENvbW1vblNlcnZpY2UubG9nKFwiZGVtbyB3b3Jrc1wiKTtcbn1cbiIsIlxucmVxdWlyZSgnLi9jb250cm9sbGVycy9kZW1vQ29udHJvbGxlcicpO1xuXG5hbmd1bGFyLm1vZHVsZSgnc2EtaGFjay5kZW1vJywgWydzYS1oYWNrLmRlbW8uZGVtb0NvbnRyb2xsZXInXSlcbiAgICAuY29uZmlnKGNvbmZpZyk7XG5cblxuZnVuY3Rpb24gY29uZmlnKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgLy9Sb3V0aW5nXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdkZWZhdWx0LmRlbW8nLCB7XG4gICAgICAgICAgICBhYnN0cmFjdDogZmFsc2UsXG4gICAgICAgICAgICB1cmw6IFwiZGVtb1wiLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL21vZHVsZXMvZGVtby92aWV3cy9kZW1vLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGVtb0NvbnRyb2xsZXIgYXMgdm0nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuIiwiXG5hbmd1bGFyLm1vZHVsZSgnc2EtaGFjay5wcm9kdWN0cycsIFtdKVxuICAgIC5jb25maWcoY29uZmlnKVxuICAgIC5jb250cm9sbGVyKCdQcm9kdWN0Q29udHJvbGxlcicsUHJvZHVjdENvbnRyb2xsZXIpO1xuXG5cbmZ1bmN0aW9uIGNvbmZpZygkc3RhdGVQcm92aWRlcikge1xuICAgIC8vUm91dGluZ1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnZGVmYXVsdC5wcm9kdWN0cycsIHtcbiAgICAgICAgICAgIGFic3RyYWN0OiBmYWxzZSxcbiAgICAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9tb2R1bGVzL3Byb2R1Y3RzL3Byb2R1Y3QuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9kdWN0Q29udHJvbGxlciBhcyB2bSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufVxuXG5cbmZ1bmN0aW9uIFByb2R1Y3RDb250cm9sbGVyKCl7XG4gICAgY29uc29sZS5sb2coXCJzYWRzYVwiKTtcbn1cbiIsIlxucmVxdWlyZSgnLi9tb2R1bGVzL3ZhbGlkYXRvcnMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9kaXJlY3RpdmVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZmlsdGVycycpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdjbG91ZGRlY29yLmNvbW1vbicsIFsnY2xvdWRkZWNvci52YWxpZGF0b3JzJywgJ2Nsb3VkZGVjb3IuZmlsdGVycycgLCdjbG91ZGRlY29yLmRpcmVjdGl2ZXMnXSk7XG59KSgpOyIsIiBcbi8vICBsb2FkIGNvbW1vbiBtb2R1bGVzXG5yZXF1aXJlKCcuL2Nsb3VkZGVjb3ItY29tbW9uJyk7XG5cbi8vIEV4cG9ydCBuYW1lc3BhY2Vcbm1vZHVsZS5leHBvcnRzID0gJ2Nsb3VkZGVjb3IuY29tbW9uJzsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnY2xvdWREZWNvci5kaXJlY3RpdmUuYWNjZXNzLWxldmVsJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnYWNjZXNzTGV2ZWwnLCBhY2Nlc3NMZXZlbCk7XG5cbmZ1bmN0aW9uIGFjY2Vzc0xldmVsKHVzZXJTZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciBhY2Nlc3NMZXZlbDtcbiAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdhY2Nlc3NMZXZlbCcsIGZ1bmN0aW9uIChhY2wpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWNsKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc0xldmVsID0gYWNsO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVDc3MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlQ3NzKCkge1xuICAgICAgICAgICAgICAgIGlmIChhY2Nlc3NMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXJTZXJ2aWNlLmlzQXV0aG9yaXplZChhY2Nlc3NMZXZlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZWxlbWVudFswXS5ub2RlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJBXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSU5QVVRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQlVUVE9OXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59IiwiLyoqXG4qIEBkZXNjIHRoaXMgZGlyZWN0aXZlIGlzIGZvciBjaGVjayB0aGUgZGlmZmVyZW5jZSBvZiB0d28gZWxlbWVudHMgYW5kIGFwcGx5IGEgY3NzIGNsYXNzIHRvIHNob3cgdGhlIGRpZmZlcmVuY2VcbiogQGV4YW1wbGUgPGlucHV0IGRpZmY9XCJ1c2VyLm5hbWVcIj48L2lucHV0PlxuKi9cblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2Nsb3VkRGVjb3IuZGlyZWN0aXZlLmRpZmYnLFtdKVxuICAgIC5kaXJlY3RpdmUoJ2RpZmYnLCBkaWZmKTtcblxuZnVuY3Rpb24gZGlmZigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcywgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKHNjb3BlLnZtLmVkaXRlZFZpZXcpe1xuICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IGF0dHJpYnV0ZXMuZGlmZi5zcGxpdCgnLicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG5ld192YWwgPSBzY29wZS52bS5uZXdWZXJzaW9uO1xuICAgICAgICAgICAgICAgIHZhciBvbGRfdmFsID0gc2NvcGUudm0ub2xkVmVyc2lvbjtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld192YWwgPSBuZXdfdmFsW2ldO1xuICAgICAgICAgICAgICAgICAgICBvbGRfdmFsID0gb2xkX3ZhbFtpXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZighYW5ndWxhci5lcXVhbHMobmV3X3ZhbCwgb2xkX3ZhbCkpe1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdkaWZmJyk7XG4gICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICB9XG4gICAgfTtcbn0iLCJyZXF1aXJlKCcuL2FjY2Vzc19sZXZlbCcpO1xucmVxdWlyZSgnLi9kaWZmJyk7IFxucmVxdWlyZSgnLi9zdGlja3knKTtcbnJlcXVpcmUoJy4vdGFiLWNoYW5nZScpO1xuIFxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnY2xvdWRkZWNvci5kaXJlY3RpdmVzJywgW1xuICAgICAgICAnY2xvdWREZWNvci5kaXJlY3RpdmUuYWNjZXNzLWxldmVsJyxcbiAgICAgICAgJ2Nsb3VkRGVjb3IuZGlyZWN0aXZlLmRpZmYnLCBcbiAgICAgICAgJ2Nsb3VkRGVjb3IuZGlyZWN0aXZlLnRhYi1jaGFuZ2UnIFxuICAgIF0pO1xufSkoKTtcblxuIiwiKGZ1bmN0aW9uIChuYW1lc3BhY2UpIHtcbiAgICAvLyBzZXQgc3RpY2t5IG1vZHVsZSBhbmQgZGlyZWN0aXZlXG4gICAgYW5ndWxhci5tb2R1bGUobmFtZXNwYWNlLCBbXSkuZGlyZWN0aXZlKG5hbWVzcGFjZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBhbmd1bGFyRWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICAvLyBnZXQgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gYW5ndWxhckVsZW1lbnRbMF0sXG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgZG9jdW1lbnRcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQsXG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgd2luZG93XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LFxuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcblxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHN0eWxlXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJyksXG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICBib3R0b20gPSBwYXJzZUZsb2F0KGF0dHJzW25hbWVzcGFjZSArICdCb3R0b20nXSksXG4gICAgICAgICAgICAgICAgICAgIG1lZGlhID0gd2luZG93Lm1hdGNoTWVkaWEoYXR0cnNbbmFtZXNwYWNlICsgJ01lZGlhJ10gfHwgJ2FsbCcpLFxuICAgICAgICAgICAgICAgICAgICB0b3AgPSBwYXJzZUZsb2F0KGF0dHJzW25hbWVzcGFjZSArICdUb3AnXSksXG5cbiAgICAgICAgICAgICAgICAvLyBpbml0aWFsaXplIHN0YXRlc1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVCb3R0b20gPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlVG9wID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgLy8gY29uZmlndXJlIHdyYXBwZXJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICdpcy0nICsgbmFtZXNwYWNlO1xuXG4gICAgICAgICAgICAgICAgLy8gYWN0aXZhdGUgc3RpY2t5XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCBlbGVtZW50IGNvbXB1dGVkIHN0eWxlXG4gICAgICAgICAgICAgICAgICAgIHZhclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGFjdGl2ZVRvcCA/ICd0b3A6JyArIHRvcCA6ICdib3R0b206JyArIGJvdHRvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBlbGVtZW50LnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2libGluZyA9IGVsZW1lbnQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSBlbGVtZW50IHdpdGggd3JhcHBlciBjb250YWluaW5nIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgbmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGUgd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTonICsgY29tcHV0ZWRTdHlsZS5kaXNwbGF5ICsgJztoZWlnaHQ6JyArIGVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgJ3B4O21hcmdpbjonICsgY29tcHV0ZWRTdHlsZS5tYXJnaW4gKyAnO3dpZHRoOicgKyBlbGVtZW50Lm9mZnNldFdpZHRoICsgJ3B4Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGUgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnbGVmdDonICsgb2Zmc2V0LmxlZnQgKyAncHg7bWFyZ2luOjA7cG9zaXRpb246Zml4ZWQ7dHJhbnNpdGlvbjpub25lOycgKyBwb3NpdGlvbiArICdweDt3aWR0aDonICsgY29tcHV0ZWRTdHlsZS53aWR0aCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZGVhY3RpdmF0ZSBzdGlja3lcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSB3cmFwcGVyLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2libGluZyA9IHdyYXBwZXIubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZSB3cmFwcGVyIHdpdGggZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKHdyYXBwZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIG5leHRTaWJsaW5nKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB1bnN0eWxlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsIHN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVuc3R5bGUgd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcblxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVUb3AgPSBhY3RpdmVCb3R0b20gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cgc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb25zY3JvbGwoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGFjdGl2YXRlZFxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVG9wIHx8IGFjdGl2ZUJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHdyYXBwZXIgb2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSB3cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVCb3R0b20gPSAhaXNOYU4oYm90dG9tKSAmJiBvZmZzZXQudG9wID4gd2luZG93LmlubmVySGVpZ2h0IC0gYm90dG9tIC0gd3JhcHBlci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVUb3AgPSAhaXNOYU4odG9wKSAmJiBvZmZzZXQudG9wIDwgdG9wO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkZWFjdGl2YXRlIGlmIHdyYXBwZXIgaXMgaW5zaWRlIHJhbmdlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFjdGl2ZVRvcCAmJiAhYWN0aXZlQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBhY3RpdmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobWVkaWEubWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IGVsZW1lbnQgb2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVCb3R0b20gPSAhaXNOYU4oYm90dG9tKSAmJiBvZmZzZXQudG9wID4gd2luZG93LmlubmVySGVpZ2h0IC0gYm90dG9tIC0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVUb3AgPSAhaXNOYU4odG9wKSAmJiBvZmZzZXQudG9wIDwgdG9wO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhY3RpdmF0ZSBpZiBlbGVtZW50IGlzIG91dHNpZGUgcmFuZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVUb3AgfHwgYWN0aXZlQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdyByZXNpemUgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvbnJlc2l6ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uZGl0aW9uYWxseSBkZWFjdGl2YXRlIHN0aWNreVxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVG9wIHx8IGFjdGl2ZUJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmUtaW5pdGlhbGl6ZSBzdGlja3lcbiAgICAgICAgICAgICAgICAgICAgb25zY3JvbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkZXN0cm95IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb25kZXN0cm95KCkge1xuICAgICAgICAgICAgICAgICAgICBvbnJlc2l6ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvbnNjcm9sbCk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbnJlc2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gYmluZCBsaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25zY3JvbGwpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbnJlc2l6ZSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95Jywgb25kZXN0cm95KTtcblxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemUgc3RpY2t5XG4gICAgICAgICAgICAgICAgb25zY3JvbGwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbn0pKCdzdGlja3knKTsiLCJcbi8qKlxuKiBAZGVzYyB0YWIgY2hhbmdlIGRpcmVjdGl2ZSBpcyB0byBjaGFuZ2UgdGFiIGluZGV4IHVwb24gYSBzZXBlcmF0ZSBldmVudChidXR0b24pIGNsaWNrXG4qIEBleGFtcGxlIDxidXR0b24gdGFiLWNoYW5nZSB0YWJzPVwiW251bWJlciBvZiB0YWJzXVwiPjwvYnV0dG9uPlxuKi9cblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2Nsb3VkRGVjb3IuZGlyZWN0aXZlLnRhYi1jaGFuZ2UnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCd0YWJDaGFuZ2UnLCB0YWJDaGFuZ2UpO1xuXG5mdW5jdGlvbiB0YWJDaGFuZ2UoJGxvY2F0aW9uLCAkYW5jaG9yU2Nyb2xsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFsaWFzID0gYXR0cmlidXRlcy5hbGlhcyB8fCBcInZtXCI7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RUYWJJbmRleCA9IGF0dHJpYnV0ZXMudGFicyA/IGF0dHJpYnV0ZXMudGFicyAtIDEgOiBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChsYXN0VGFiSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVbYWxpYXNdLnNlbGVjdGVkSW5kZXggPSAoc2NvcGVbYWxpYXNdLnNlbGVjdGVkSW5kZXggPT09IGxhc3RUYWJJbmRleCkgPyAwIDogc2NvcGVbYWxpYXNdLnNlbGVjdGVkSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgICAgICAgICBpZiAoJGxvY2F0aW9uLmhhc2goKSAhPT0gXCJmb3JtLXRhYlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5oYXNoKFwiZm9ybS10YWJcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGFuY2hvclNjcm9sbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGluaXQpO1xuICAgICAgICB9XG4gICAgfTtcbn0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnY2xvdWREZWNvci5maWx0ZXJzLmNhcGl0YWxpemUnLCBbXSlcbiAgICAuZmlsdGVyKCdjYXBpdGFsaXplJywgY2FwaXRhbGl6ZSk7XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemUoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiAoISFpbnB1dCkgPyBpbnB1dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpIDogJyc7XG4gICAgfTtcbn1cbiIsInJlcXVpcmUoJy4vY2FwaXRhbGl6ZScpO1xucmVxdWlyZSgnLi9sYW5ndWFnZVNwbGl0Jyk7XG5cblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnY2xvdWRkZWNvci5maWx0ZXJzJywgW1xuICAgICAgICAnY2xvdWREZWNvci5maWx0ZXJzLmNhcGl0YWxpemUnLFxuICAgICAgICAnY2xvdWREZWNvci5maWx0ZXJzLmxhbmd1YWdlX3NwbGl0J1xuICAgIF0pO1xufSkoKTsiLCIvKipcbiAqIFRoaXMgZmlsdGVyIHJlbW92ZSBjb3VudHJ5IGNvZGUgZnJvbSBsYW5ndWFnZSBjb2RlXG4gKi9cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbG91ZERlY29yLmZpbHRlcnMubGFuZ3VhZ2Vfc3BsaXQnLCBbXSlcbiAgICAuZmlsdGVyKCdsYW5ndWFnZVNwbGl0JywgbGFuZ3VhZ2VTcGxpdCk7XG5cbmZ1bmN0aW9uIGxhbmd1YWdlU3BsaXQoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGFuZ3VsYXIuaXNEZWZpbmVkKGlucHV0KSAmJlxuICAgICAgICAgICAgaW5wdXQgIT09IG51bGwgJiZcbiAgICAgICAgICAgIGlucHV0ICE9PSAnJyAmJlxuICAgICAgICAgICAgaW5wdXQuc2VhcmNoKCctJykgIT09IC0xXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnNwbGl0KCctJylbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiLyoqXG4qIEBkZXNjIGFscGhhIG51bWVyaWMgVmFsIGRpcmVjdGl2ZSBpcyB0byB2YWxpZGF0ZSBhbHBoYW5ldW1lcmljIHZhbHVlcyBwcm92aWRlZCB3aXRoIHRoZSBVSVxuKiBAZXhhbXBsZSA8aW5wdXQgYWxwaGEtbnVtZXJpYy12YWw9XCJET1QsIFNJTkdMRS1RVU9URSwgU0xBU0hcIj48L2lucHV0PlxuKi9cblxuYW5ndWxhci5tb2R1bGUoJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5hbHBoYU51bWVyaWMnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdhbHBoYU51bWVyaWNWYWwnLCBhbHBoYU51bWVyaWNWYWwpO1xuXG5mdW5jdGlvbiBhbHBoYU51bWVyaWNWYWwoJGdsb2JhbCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIFJFR0VYX1NUUklORyA9ICcnO1xuICAgICAgICAgICAgdmFyIHZhbGlkX2NoYXJhY3RlcnMgPSBhdHRycy5hbHBoYU51bWVyaWNWYWw7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZ2xvYmFsLkNIQVJBQ1RFUlMsIGZ1bmN0aW9uIChjaGFyYWN0ZXIsIGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB2YWxpZF9jaGFyYWN0ZXJzLmluZGV4T2YobGFiZWwpID4gLTEgKXtcbiAgICAgICAgICAgICAgICAgICAgUkVHRVhfU1RSSU5HID0gUkVHRVhfU1RSSU5HICsgY2hhcmFjdGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBSRUdFWF9TVFJJTkcgPSBuZXcgUmVnRXhwKCdbXmEtekEtWjAtOScgKyBSRUdFWF9TVFJJTkcgKyAnXScpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNsZWFuID0gdmFsLnJlcGxhY2UoUkVHRVhfU1RSSU5HLCAnJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2xlYW4gIT09IHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGNsZWFuKTtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjbGVhbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdjbG91ZERlY29yLnZhbGlkYXRvcnMuZW1haWwnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdlbWFpbFZhbCcsIGVtYWlsVmFsKTtcblxuZnVuY3Rpb24gZW1haWxWYWwoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsbSwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgICAgIC8vIG9ubHkgYXBwbHkgdGhlIHZhbGlkYXRvciBpZiBuZ01vZGVsIGlzIHByZXNlbnQgYW5kIEFuZ3VsYXIgaGFzIGFkZGVkIHRoZSBlbWFpbCB2YWxpZGF0b3JcbiAgICAgICAgICAgIGlmIChjdHJsICYmIGN0cmwuJHZhbGlkYXRvcnMuZW1haWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgRU1BSUxfUkVHRVhQID0gL15bX2EtekEtWjAtOV0rKFxcLltfYS16QS1aMC05XSspKkBbYS16QS1aMC05LV0rKFxcLlthLXpBLVowLTktXSspKihcXC5bYS16XXsyLDR9KSQvO1xuXG4gICAgICAgICAgICAgICAgLy8gdGhpcyB3aWxsIG92ZXJ3cml0ZSB0aGUgZGVmYXVsdCBBbmd1bGFyIGVtYWlsIHZhbGlkYXRvclxuICAgICAgICAgICAgICAgIGN0cmwuJHZhbGlkYXRvcnMuZW1haWwgPSBmdW5jdGlvbihtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHJsLiRpc0VtcHR5KG1vZGVsVmFsdWUpIHx8IEVNQUlMX1JFR0VYUC50ZXN0KG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4gIiwicmVxdWlyZSgnLi9hbHBoYU51bWVyaWMnKTtcbnJlcXVpcmUoJy4vZW1haWwnKTtcbnJlcXVpcmUoJy4vaW50ZWdlcicpO1xucmVxdWlyZSgnLi9tYXRjaCcpO1xucmVxdWlyZSgnLi9udW1iZXInKTtcbnJlcXVpcmUoJy4vcmVzZXRQYXJzZScpO1xucmVxdWlyZSgnLi91bmlxdWUnKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnY2xvdWRkZWNvci52YWxpZGF0b3JzJywgW1xuICAgICAgICAnY2xvdWREZWNvci52YWxpZGF0b3JzLmFscGhhTnVtZXJpYycsXG4gICAgICAgICdjbG91ZERlY29yLnZhbGlkYXRvcnMuZW1haWwnLFxuICAgICAgICAnY2xvdWREZWNvci52YWxpZGF0b3JzLmludGVnZXInLFxuICAgICAgICAnY2xvdWREZWNvci52YWxpZGF0b3JzLm1hdGNoJyxcbiAgICAgICAgJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5udW1iZXInLFxuICAgICAgICAnY2xvdWREZWNvci52YWxpZGF0b3JzLnJlc2V0UGFyc2UnLFxuICAgICAgICAnY2xvdWREZWNvci52YWxpZGF0b3JzLnVuaXF1ZSdcbiAgICBdKTtcbn0pKCk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCdjbG91ZERlY29yLnZhbGlkYXRvcnMuaW50ZWdlcicsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2ludGVnZXJWYWwnLCBpbnRlZ2VyVmFsKTtcblxuZnVuY3Rpb24gaW50ZWdlclZhbCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHZhbCkgfHwgdmFsID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjbGVhbiA9IHZhbC50b1N0cmluZygpLnJlcGxhY2UoL1teMC05XS9nLCAnJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2xlYW4gIT09IHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGNsZWFuKTtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjbGVhbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG4iLCIvKipcbiogQGRlc2MgdGhpcyBkaXJlY3RpdmUgaXMgZm9yIG1hdGNoaW5nIHR3byB2YWx1ZXNcbiogQGV4YW1wbGUgPGlucHV0IG1hdGNoPVwiW25nLW1vZGVsIHRvIHdoaWNoIG5lZWRzIHRvIGJlIGNvbXBhcmVkIHRvXVwiPjwvaW5wdXQ+XG4qL1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5tYXRjaCcsW10pXG4gICAgLmRpcmVjdGl2ZSgnbWF0Y2gnLCBtYXRjaCk7XG5cbmZ1bmN0aW9uIG1hdGNoKCRwYXJzZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHsgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMubWF0Y2gpKHNjb3BlKSA9PT0gY3RybC4kbW9kZWxWYWx1ZTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHZhbGlkaXR5KSB7XG4gICAgICAgICAgICAgICAgY3RybC4kc2V0VmFsaWRpdHkoJ21hdGNoJywgdmFsaWRpdHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiYW5ndWxhci5tb2R1bGUoJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5udW1iZXInLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdudW1iZXJWYWwnLCBudW1iZXJWYWwpO1xuXG5mdW5jdGlvbiBudW1iZXJWYWwoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMucHVzaChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZCh2YWwpIHx8IHZhbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YWwgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2xlYW4gPSB2YWwudG9TdHJpbmcoKS5yZXBsYWNlKC9bXjAtOVxcLl0vZywgJycpO1xuICAgICAgICAgICAgICAgIHZhciBkZWNpbWFsQ2hlY2sgPSBjbGVhbi5zcGxpdCgnLicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzVW5kZWZpbmVkKGRlY2ltYWxDaGVja1sxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVjaW1hbENoZWNrWzFdID0gZGVjaW1hbENoZWNrWzFdLnNsaWNlKDAsMik7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFuID0gZGVjaW1hbENoZWNrWzBdICsgJy4nICsgZGVjaW1hbENoZWNrWzFdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09IGNsZWFuKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoY2xlYW4pO1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQuYmluZCgna2V5cHJlc3MnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzMikge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbG91ZERlY29yLnZhbGlkYXRvcnMucmVzZXRQYXJzZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ3Jlc2V0UGFyc2UnLCByZXNldFBhcnNlKTtcblxuZnVuY3Rpb24gcmVzZXRQYXJzZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICAgICAgdmFyIGZvcm1fbmFtZSA9IGF0dHJpYnV0ZXMuZm9ybV9uYW1lIHx8IFwicGRfZm9ybVwiO1xuICAgICAgICAgICAgdmFyIGFsaWFzID0gYXR0cmlidXRlcy5hbGlhcyB8fCBcImpvdXJuYWxpc3RcIjtcblxuXG5cbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlW2FsaWFzXVtmb3JtX25hbWVdLiRzdWJtaXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gYXR0cmlidXRlcy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNfdXNlcl9lcnJvciA9IGF0dHJpYnV0ZXMucmVzZXRQYXJzZTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlW2FsaWFzXVtmb3JtX25hbWVdW2ZpZWxkXS4kc2V0VmFsaWRpdHkoJ3BhcnNlJywgdHJ1ZSwgbmdNb2RlbEN0cmwpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZVthbGlhc10uZXJyb3JzICYmIGlzX3VzZXJfZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlW2FsaWFzXS5lcnJvcnNbaXNfdXNlcl9lcnJvcl0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsIi8qKlxuKiBAZGVzYyB0aGlzIGRpcmVjdGl2ZSBpcyBmb3IgY2hlY2sgdGhlIHVuaXF1ZW5lc3MgYWdhaW5zdCBnaXZlbiBhcnJheSBvZiBuZy1tb2RlbCB2YWx1ZXNcbiogQGV4YW1wbGUgPGlucHV0IHVuaXF1ZS1lbWFpbD1cIm5nLW1vZGVsMSwgbmctbW9kZWwyLi4uLlwiPjwvaW5wdXQ+XG4qL1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnY2xvdWREZWNvci52YWxpZGF0b3JzLnVuaXF1ZScsW10pXG4gICAgLmRpcmVjdGl2ZSgndW5pcXVlJywgdW5pcXVlKTtcblxuZnVuY3Rpb24gdW5pcXVlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbHVlO1xuXG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsO1xuXG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMudW5pcXVlICYmIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eSgnaXNVbmlxdWVFbWFpbCcsIGlzVmFsaWQoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGlzVmFsaWQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXkgPSBhdHRyaWJ1dGVzLnVuaXF1ZS5yZXBsYWNlKC9bXFxzXSsvZywgJycpLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFycmF5LCBmdW5jdGlvbihlbWFpbEZpZWxkKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsVmFsdWUgPSAkKFwiaW5wdXRbbmFtZT1cIisgZW1haWxGaWVsZCArXCJdXCIpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsaWRpdHkgPSBnZXRWYWxpZGl0eShlbWFpbFZhbHVlLCBlbWFpbEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0RmllbGQoZW1haWxGaWVsZCwgdmFsaWRpdHkpO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbGlkICYmIHZhbGlkaXR5O1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFycmF5LCBmdW5jdGlvbihmaWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWxGaWVsZCAhPT0gZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNWYWxpZCA9ICgoJChcImlucHV0W25hbWU9XCIrIGZpZWxkICtcIl1cIikudmFsKCkgKSAhPT0gZW1haWxWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RmllbGQoZW1haWxGaWVsZCwgaXNWYWxpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEZpZWxkKGZpZWxkLCBpc1ZhbGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRWYWxpZGl0eShlbWFpbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSAhPT0gZW1haWxWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldEZpZWxkKGVtYWlsRmllbGQsIHZhbGlkaXR5KSB7XG4gICAgICAgICAgICAgICAgc2NvcGUudm0uY2RfZm9ybVtlbWFpbEZpZWxkXS4kc2V0VmFsaWRpdHkoJ2lzVW5pcXVlRW1haWwnLCB2YWxpZGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG59IiwiXG5cbmFuZ3VsYXIubW9kdWxlKCdzYS1oYWNrLmNvbnRyb2xsZXJzJywgW10pO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdzYS1oYWNrLmNvbnRyb2xsZXJzJzsiLCJcblxuYW5ndWxhci5tb2R1bGUoJ3NhLWhhY2suZGlyZWN0aXZlcycsIFtdKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnc2EtaGFjay5kaXJlY3RpdmVzJzsiLCJyZXF1aXJlKCcuL2NvbnRyb2xsZXJzJyk7XG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMnKTtcbnJlcXVpcmUoJy4vdmFsaWRhdG9ycycpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdzYS1oYWNrLnNoYXJlZCcsIFsnc2EtaGFjay52YWxpZGF0b3JzJywgJ3NhLWhhY2suZGlyZWN0aXZlcycsICdzYS1oYWNrLnNlcnZpY2VzJywgJ3NhLWhhY2suY29udHJvbGxlcnMnXSk7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdzYS1oYWNrLnNoYXJlZCc7IiwiXG5hbmd1bGFyLm1vZHVsZSgnc2EtaGFjay5jb250cm9sbGVycy5Db21tb25TZXJ2aWNlJywgW10pXG4gICAgLnNlcnZpY2UoJ0NvbW1vblNlcnZpY2UnLCBDb21tb25TZXJ2aWNlKTtcblxuZnVuY3Rpb24gQ29tbW9uU2VydmljZSgpIHtcblxuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIGxvZ291dDogbG9nb3V0LFxuICAgICAgICBsb2c6IGxvZ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2dpbigpIHtcbiAgICAgICAgdm0ubG9nKFwibG9naW5cIik7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgIHZtLmxvZyhcImxvZ291dFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2coc3RyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHN0cik7XG4gICAgfVxuXG5cbn1cblxuXG4iLCJcbnJlcXVpcmUoJy4vY29tbW9uU2VydmljZScpO1xucmVxdWlyZSgnLi91c2VyU2VydmljZScpO1xuXG5hbmd1bGFyLm1vZHVsZSgnc2EtaGFjay5zZXJ2aWNlcycsIFsnc2EtaGFjay5jb250cm9sbGVycy5Db21tb25TZXJ2aWNlJywnc2EtaGFjay5jb250cm9sbGVycy5Vc2VyU2VydmljZSddKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnc2EtaGFjay5zZXJ2aWNlcyc7IiwiYW5ndWxhci5tb2R1bGUoJ3NhLWhhY2suY29udHJvbGxlcnMuVXNlclNlcnZpY2UnLCBbXSlcbiAgICAuc2VydmljZSgnVXNlclNlcnZpY2UnLCBVc2VyU2VydmljZSk7XG5cbmZ1bmN0aW9uIFVzZXJTZXJ2aWNlKCkge1xuXG4gICAgdmFyIHZtID0gdGhpcztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG4gICAgICAgIGxvZzogbG9nXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvZ2luKCkge1xuICAgICAgICB2bS5sb2coXCJsb2dpblwiKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgICAgdm0ubG9nKFwibG9nb3V0XCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZyhzdHIpIHtcbiAgICAgICAgY29uc29sZS5sb2coc3RyKTtcbiAgICB9XG5cblxufSIsInZhciAkZ2xvYmFsID0ge307XG5cbiRnbG9iYWwuU0VDVElPTiA9ICdwcmVzc2RlY29yJztcbiRnbG9iYWwuSVRFTVNfUEVSX1BBR0UgPSAnMjAnO1xuXG4vKipcbiAqIEhUVFAgcmVzcG9uc2UgY29kZXNcbiAqL1xuJGdsb2JhbC5IVFRQMjAwID0gMjAwO1xuJGdsb2JhbC5IVFRQMjAxID0gMjAxO1xuJGdsb2JhbC5IVFRQMjA0ID0gMjA0O1xuJGdsb2JhbC5IVFRQNDAwID0gNDAwO1xuJGdsb2JhbC5IVFRQNDAxID0gNDAxO1xuJGdsb2JhbC5IVFRQNDAzID0gNDAzO1xuJGdsb2JhbC5IVFRQNDA0ID0gNDA0O1xuJGdsb2JhbC5IVFRQNDIyID0gNDIyO1xuJGdsb2JhbC5IVFRQNTAwID0gNTAwO1xuXG4vKipcbiAqIEFsZXJ0IHR5cGVzXG4gKi9cbiRnbG9iYWwuSU5GTyA9ICdpbmZvJztcbiRnbG9iYWwuRVJST1IgPSAnZXJyb3InO1xuJGdsb2JhbC5TVUNDRVNTID0gJ3N1Y2Nlc3MnO1xuJGdsb2JhbC5XQVJOSU5HID0gJ3dhcm5pbmcnO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBVc2VyICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuLyoqXG4gKiBBY3Rpb24gdHlwZXNcbiAqL1xuJGdsb2JhbC5BQ1RJT05TID0ge1xuICAgIEFERDogJ2FkZCcsXG4gICAgRURJVDogJ2VkaXQnXG59O1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBTdWJzY3JpcHRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogc29sdXRpb24gdHlwZXNcbiAqL1xuJGdsb2JhbC5TT0xVVElPTlMgPSB7XG4gICAgQ0xPVURERUNPUjogJ2Nsb3VkZGVjb3InLFxuICAgIE1BUktFVFBMQUNFOiAnbWFya2V0cGxhY2UnXG59O1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQcm9kdWN0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4kZ2xvYmFsLkNPTE9SX1ZBUklBTlQgPSAnY29sb3InO1xuXG4kZ2xvYmFsLkNPTE9SUyA9IFtcbiAgICB7ICdjb2RlJzogJ2VkODQ3NycsICdjbGFzcyc6ICdiZy0xJyB9LFxuICAgIHsgJ2NvZGUnOiAnZDI0MDM2JywgJ2NsYXNzJzogJ2JnLTInIH0sXG4gICAgeyAnY29kZSc6ICdhNTI2MTgnLCAnY2xhc3MnOiAnYmctMycgfSxcbiAgICB7ICdjb2RlJzogJ2MyNGIyMScsICdjbGFzcyc6ICdiZy00JyB9LFxuICAgIHsgJ2NvZGUnOiAnNzAyMDFjJywgJ2NsYXNzJzogJ2JnLTUnIH0sXG4gICAgeyAnY29kZSc6ICdmYmYyOTgnLCAnY2xhc3MnOiAnYmctNicgfSxcbiAgICB7ICdjb2RlJzogJ2ZhZGU0YicsICdjbGFzcyc6ICdiZy03JyB9LFxuICAgIHsgJ2NvZGUnOiAnZjViYjQxJywgJ2NsYXNzJzogJ2JnLTgnIH0sXG4gICAgeyAnY29kZSc6ICdmMmE1M2EnLCAnY2xhc3MnOiAnYmctOScgfSxcbiAgICB7ICdjb2RlJzogJ2VlNzkyZicsICdjbGFzcyc6ICdiZy0xMCcgfSxcbiAgICB7ICdjb2RlJzogJ2MzNGMyMScsICdjbGFzcyc6ICdiZy0xMScgfSxcbiAgICB7ICdjb2RlJzogJ2Y3Y2RmMycsICdjbGFzcyc6ICdiZy0xMicgfSxcbiAgICB7ICdjb2RlJzogJ2E5NGM4YScsICdjbGFzcyc6ICdiZy0xMycgfSxcbiAgICB7ICdjb2RlJzogJzZkMjg1NScsICdjbGFzcyc6ICdiZy0xNCcgfSxcbiAgICB7ICdjb2RlJzogJzNkMTYyMycsICdjbGFzcyc6ICdiZy0xNScgfSxcbiAgICB7ICdjb2RlJzogJzUwMmUxNScsICdjbGFzcyc6ICdiZy0xNicgfSxcbiAgICB7ICdjb2RlJzogJzYwNTM0NycsICdjbGFzcyc6ICdiZy0xNycgfSxcbiAgICB7ICdjb2RlJzogJ2QxZjNiNicsICdjbGFzcyc6ICdiZy0xOCcgfSxcbiAgICB7ICdjb2RlJzogJ2NkZjM4MScsICdjbGFzcyc6ICdiZy0xOScgfSxcbiAgICB7ICdjb2RlJzogJzc4YzU2MicsICdjbGFzcyc6ICdiZy0yMCcgfSxcbiAgICB7ICdjb2RlJzogJzYyOTA1NScsICdjbGFzcyc6ICdiZy0yMScgfSxcbiAgICB7ICdjb2RlJzogJzJlNTAyNScsICdjbGFzcyc6ICdiZy0yMicgfSxcbiAgICB7ICdjb2RlJzogJzJlNjc2NycsICdjbGFzcyc6ICdiZy0yMycgfSxcbiAgICB7ICdjb2RlJzogJ2UxZmJmZScsICdjbGFzcyc6ICdiZy0yNCcgfSxcbiAgICB7ICdjb2RlJzogJ2QwZThmMicsICdjbGFzcyc6ICdiZy0yNScgfSxcbiAgICB7ICdjb2RlJzogJzVhYTJiMCcsICdjbGFzcyc6ICdiZy0yNicgfSxcbiAgICB7ICdjb2RlJzogJzNkOGFiMicsICdjbGFzcyc6ICdiZy0yNycgfSxcbiAgICB7ICdjb2RlJzogJzI5M2E0ZScsICdjbGFzcyc6ICdiZy0yOCcgfSxcbiAgICB7ICdjb2RlJzogJzFlMmQzZCcsICdjbGFzcyc6ICdiZy0yOScgfSxcbiAgICB7ICdjb2RlJzogJzEzMWIyNicsICdjbGFzcyc6ICdiZy0zMCcgfSxcbiAgICB7ICdjb2RlJzogJzEyMTMxYScsICdjbGFzcyc6ICdiZy0zMScgfSxcbiAgICB7ICdjb2RlJzogJ2FjYWNhYycsICdjbGFzcyc6ICdiZy0zMicgfVxuXTtcblxuJGdsb2JhbC5QUk9EVUNUX1NBVkUgPSAnc2F2ZSc7XG4kZ2xvYmFsLlBST0RVQ1RfU0FWRV9EUkFGVCA9ICdzYXZlX2RyYWZ0JztcbiRnbG9iYWwuUFJPRFVDVF9FRElUID0gJ2VkaXQnO1xuJGdsb2JhbC5QUk9EVUNUX0VESVRfRFJBRlQgPSAnZWRpdF9kcmFmdCc7XG5cbiRnbG9iYWwuUFJPRFVDVF9JTUFHRSA9ICdpbWFnZSc7XG4kZ2xvYmFsLlBST0RVQ1RfTk9UX0ZPVU5EID0gJ1BSRDAwNic7XG5cbi8qKioqKioqKiBTcGVjaWFsIGNoYXJhY3RlcnMgdG8gc2V0IGFzIGFscGhhIG51bWVyaWMgdmFsdWVzICoqKioqKioqKioqKiovXG4kZ2xvYmFsLkNIQVJBQ1RFUlMgPSB7XG4gICAgJ1VOREVSU0NPUkUnOiAnXycsXG4gICAgJ0NPTU1BJzogJywnLFxuICAgICdTUEFDRSc6ICcgJyxcbiAgICAnRE9UJzogJy4nLFxuICAgICdTTEFTSCc6ICcvJyxcbiAgICAnQU1QRVJTQU5EJzogJyYnLFxuICAgICdTSU5HTEUtUVVPVEUnOiAnXFwnJyxcbiAgICAnUVVPVEUnOiAnXCInLFxuICAgICdBU1RFUklTSyc6ICcqJyxcbiAgICAnQVQnOiAnQCcsXG4gICAgJ1BMVVMnOiAnKycsXG4gICAgJ0hBU0gnOiAnIycsXG4gICAgJ1FVRVNUSU9OLU1BUksnOiAnPycsXG4gICAgJ0hZUEhFTic6ICctJ1xufTtcbm1vZHVsZS5leHBvcnRzID0gJGdsb2JhbDsiLCJ2YXIgJG1lc3NhZ2UgPSB7fTtcblxuXG4vKipcbiAqIFN1Y2Nlc3MgbWVzc2FnZXNcbiAqL1xuJG1lc3NhZ2UuUE9TVF9BRERFRF9TVUNDRVNTID0gJ1Bvc3QgYWRkZWQgc3VjY2Vzc2Z1bGx5JztcbiRtZXNzYWdlLlBPU1RfVVBEQVRFRF9TVUNDRVNTID0gJ1Bvc3QgdXBkYXRlZCBzdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuUE9TVF9ERUxFVEVEX1NVQ0NFU1MgPSAnUG9zdCBkZWxldGVkIHN1Y2Nlc3NmdWxseSc7XG5cbiRtZXNzYWdlLlBST0RVQ1RfQURERURfU1VDQ0VTUyA9ICdQcm9kdWN0IGhhcyBiZWVuIGFkZGVkJztcbiRtZXNzYWdlLlBST0RVQ1RfRFJBRlRfQURERURfU1VDQ0VTUyA9ICdQcm9kdWN0IGhhcyBiZWVuIGFkZGVkIGFzIGRyYWZ0JztcbiRtZXNzYWdlLlBST0RVQ1RfVVBEQVRFRF9TVUNDRVNTID0gJ1Byb2R1Y3QgaGFzIGJlZW4gdXBkYXRlZCc7XG4kbWVzc2FnZS5QUk9EVUNUX0RSQUZUX1VQREFURURfU1VDQ0VTUyA9ICdQcm9kdWN0IGhhcyBiZWVuIHVwZGF0ZWQgYXMgZHJhZnQnO1xuJG1lc3NhZ2UuUFJPRFVDVF9OT1RfVVBEQVRFRCA9ICdOb3RoaW5nIGZvciB1cGRhdGUnO1xuJG1lc3NhZ2UuUFJPRFVDVF9OT1RfRk9VTkRfRVJSID0gJ05vIFByb2R1Y3RzIGZvdW5kJztcbiRtZXNzYWdlLlBST0RVQ1RfRE9XTkxPQURfTUFJTF9TVUNDRVNTID0gXCJNYWlsIFNlbnQgU3VjY2Vzc2Z1bGx5XCI7XG4kbWVzc2FnZS5QUk9EVUNUX0RPV05MT0FEX0VSUk9SID0gXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2FpblwiO1xuJG1lc3NhZ2UuUFJPRFVDVF9ET1dOTE9BRF9JTUFHRV9FTVBUWSA9IFwiQXRsZWFzdCBvbmUgaW1hZ2Ugc2hvdWxkIGJlIHNlbGVjdGVkIHRvIGRvd25sb2FkXCI7XG4vL3JldGFpbGVyXG4kbWVzc2FnZS5SRVRBSUxFUl9BRERFRF9TVUNDRVNTID0gJ1JldGFpbGVyIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5JztcblxuLy9hY2NvdW50IFxuJG1lc3NhZ2UuUkVUQUlMRVJfVVNFUl9BRERFRF9TVUNDRVNTID0gJ1JldGFpbGVyIHVzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5JztcbiRtZXNzYWdlLlJFVEFJTEVSX1VTRVJfRURJVEVEX1NVQ0NFU1MgPSAnUmV0YWlsZXIgdXNlciB1cGRhdGVkIHN1Y2Nlc3NmdWxseSc7XG4kbWVzc2FnZS5SRVRBSUxFUl9FRElURURfU1VDQ0VTUyA9ICdSZXRhaWxlciB1cGRhdGVkIHN1Y2Nlc3NmdWxseSc7XG4kbWVzc2FnZS5BQ0NPVU5UX0lNQUdFX1VQTE9BRF9TVUNDRVNTID0gXCJSZXRhaWxlciBzdG9yZSBpbWFnZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHlcIjtcblxuLy9qb3VybmFsaXN0XG4kbWVzc2FnZS5KT1VSTkFMSVNUX1VTRVJfQURERURfU1VDQ0VTUyA9ICdKb3VybmFsaXN0IHVzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5JztcblxuLy9jc29cbiRtZXNzYWdlLlBST0RVQ1RfQUNDRVBUX1NVQ0NFU1MgPSAnUHJvZHVjdCBBY2NlcHRlZCBTdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuUFJPRFVDVF9SRUpFQ1RfU1VDQ0VTUyA9ICdQcm9kdWN0IFJlamVjdGVkIFN1Y2Nlc3NmdWxseSc7XG4kbWVzc2FnZS5SRVRBSUxFUl9BQ0NFUFRfU1VDQ0VTUyA9ICdSZXRhaWxlciBBY2NlcHRlZCBTdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuUkVUQUlMRVJfUkVKRUNUX1NVQ0NFU1MgPSAnUmV0YWlsZXIgUmVqZWN0ZWQgU3VjY2Vzc2Z1bGx5JztcblxuLy9icmFuZFxuJG1lc3NhZ2UuQlJBTkRfQUREX1NVQ0NFU1MgPSAnQnJhbmQgYWRkZWQgc3VjY2Vzc2Z1bGx5Lic7XG4kbWVzc2FnZS5CUkFORF9QUk9GSUxFX0ZFVENIX0VSUk9SID0gXCJCcmFuZCBub3QgZm91bmRcIjtcblxuXG4vKipcbiAqIEluZm9ybWF0aW9uIG1lc3NhZ2VzXG4gKi9cbiRtZXNzYWdlLlBPU1RfTElTVF9FTVBUWV9JTkZPID0gJ1Bvc3RzIG5vdCBmb3VuZCc7XG4kbWVzc2FnZS5GT1JNX0lOVkFMSUQgPSAnUGxlYXNlIGVudGVyIG1hbmRhdG9yeSBmaWVsZHMgdG8gcHJvY2VlZCc7XG5cbi8vYWNjb3VudFxuJG1lc3NhZ2UuUkVUQUlMRVJfVVNFUl9GRVRDSF9FUlJPUiA9ICdSZXRhaWxlciB1c2VycyBub3QgZm91bmQuJztcbiRtZXNzYWdlLlJFVEFJTEVSX1BST0ZJTEVfRkVUQ0hfRVJST1IgPSAnUmV0YWlsZXIgcHJvZmlsZSBub3QgZm91bmQuJztcblxuXG5cbi8qKlxuICogRXJyb3IgbWVzc2FnZXNcbiAqL1xuLy9QUk9EVUNUX0RFVEFJTF9MRUFEX0ZBSUxcbiRtZXNzYWdlLkhUVFA1MDBfRVJST1IgPSAnU29tZSBlcnJvciBoYXMgb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4nO1xuJG1lc3NhZ2UuTUFSS0VUX1BMQUNFX0xJU1RfRVJST1IgPSAnTWFya2V0IHBsYWNlcyBub3QgZm91bmQnO1xuJG1lc3NhZ2UuTUFSS0VUX1BMQUNFX0FUVFJJQlVURVNfRVJST1IgPSAnTWFya2V0IHBsYWNlcyBhdHRyaWJ1dGVzIG5vdCBmb3VuZCc7XG4kbWVzc2FnZS5DQVRFR09SWV9GRVRDSF9FUlJPUiA9ICdDYW4gbm90IGZldGNoIHRoZSBjYXRlZ29yeSc7XG5cbiRtZXNzYWdlLkNPVU5UUllfRkVUQ0hfRVJST1IgPSAnQ291bnRyaWVzIG5vdCBmb3VuZC4nO1xuJG1lc3NhZ2UuQ0lUWV9GRVRDSF9FUlJPUiA9ICdDaXRpZXMgbm90IGZvdW5kLic7XG4kbWVzc2FnZS5ST0xFU19GRVRDSF9FUlJPUiA9ICdVc2VyIHJvbGVzIG5vdCBmb3VuZC4nO1xuXG4kbWVzc2FnZS5QUk9EVUNUX05PVF9GT1VORCA9ICdBbGwgdGhlIHByb2R1Y3RzIGhhcyBsb2FkZWQnO1xuJG1lc3NhZ2UuUFJPRFVDVDQwNF9FUlJPUiA9ICdTb3JyeSwgdGhlIHJlcXVlc3RlZCBwcm9kdWN0IGlzIG5vdCBhdmFpbGFibGUnO1xuXG4vL1Byb2R1Y3QgRWRpdFxuJG1lc3NhZ2UuUFJPRFVDVF9ERVRBSUxfTEVBRF9GQUlMID0gJ1NvbWUgZXJyb3IgaGFzIG9jY3VycmVkLiBQbGVhc2UgdHJ5IGFnYWluJztcblxuLy9hY2NvdW50XG4kbWVzc2FnZS5BQ0NPVU5UX0lNQUdFX1VQTE9BRF9FUlJPUiA9IFwiUmV0YWlsZXIgc3RvcmUgaW1hZ2UgdXBsb2FkIGVycm9yXCI7XG4kbWVzc2FnZS5DVVJSRU5DWV9MSVNUX0ZFVENIX0VSUk9SID0gXCJDYW5ub3QgZmV0Y2ggY3VycmVuY3kgbGlzdC5cIjtcbiRtZXNzYWdlLkNVUlJFTkNZX0ZFVENIX0VSUk9SID0gXCJDYW5ub3QgZmV0Y2ggY3VycmVuY3kgY29kZS5cIjtcblxuLy9zdWJzY3JpcHRpb25cbiRtZXNzYWdlLlNVQlNDUklQVElPTl9QTEFOX0ZFVENIX0VSUk9SID0gJ1N1YnNjcmlwdGlvbiBwbGFuIG5vdCBmb3VuZC4nO1xuXG4vL2Nzb1xuJG1lc3NhZ2UuUFJPRFVDVF9GRVRDSF9FUlJPUiA9IFwiUHJvZHVjdCBub3QgZm91bmQuXCI7XG5cbi8vcmV0YWlsZXJcbiRtZXNzYWdlLlJFVEFJTEVSX0xJU1RfTk9UX0ZPVU5EID0gXCJSZXRhaWxlciBSZXF1ZXN0cyBsb2FkaW5nIGVycm9yLlwiO1xuXG4vL2JyYW5kXG4kbWVzc2FnZS5VU0VSX1JPTEVfTk9UX0ZPVU5EID0gJ1VzZXIgUm9sZSBub3QgZm91bmQuJztcbiRtZXNzYWdlLkZPUk1fSU5WQUxJRCA9ICdQbGVhc2UgZmlsbCBtYW5kb3RvcnkgZmllbGRzIHRvIHByb2NlZWQnO1xuXG5cbi8vQUNMXG4kbWVzc2FnZS5VTkFUSE9SSVpFRCA9IFwiWW91IGRvbid0IGhhdmUgIHJlcXVpcmVkIHBlcm1pc3Npb25zLlwiO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gJG1lc3NhZ2U7IiwiXG5cbmFuZ3VsYXIubW9kdWxlKCdzYS1oYWNrLnZhbGlkYXRvcnMnLCBbXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3NhLWhhY2sudmFsaWRhdG9ycyc7Il19
