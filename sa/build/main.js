(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

require('./shared/common');
require('./shared');




require('./modules/demo/demo.routing');
require('./modules/products/product');
require('./modules/cart/cart');

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
        'sa-hack.products',
        'sa-hack.cart'
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
            url:"/",
            views: {
                layout: {
                    templateUrl: 'app/shared/views/default-layout.html'
                }
            }
        });

        $urlRouterProvider.otherwise('/demo');

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
    
   
//$state.go('default.demo');
}

},{"./modules/cart/cart":2,"./modules/demo/demo.routing":4,"./modules/products/product":5,"./shared":27,"./shared/common":7,"./shared/utils/constants.js":31,"./shared/utils/messages.js":32}],2:[function(require,module,exports){

angular.module('sa-hack.cart', [])
    .config(config)
    .controller('CartController',CartController);


function config($stateProvider) {
    //Routing
    $stateProvider
        .state('default.cart', {
            abstract: false,
            url: "cart",
            views: {
                content: {
                    templateUrl: 'app/modules/cart/cart.html',
                    controller: 'CartController as vm'
                }
            }
        });
}


function CartController(){
    console.log("Cart Start");
}

},{}],3:[function(require,module,exports){
angular.module('sa-hack.demo.demoController', [])
    .controller('DemoController', DemoController);


function DemoController(CommonService) {
    CommonService.log("demo works");
}

},{}],4:[function(require,module,exports){

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


},{"./controllers/demoController":3}],5:[function(require,module,exports){

angular.module('sa-hack.products', [])
    .config(config)
    .controller('ProductController',ProductController);


function config($stateProvider) {
    //Routing
    $stateProvider
        .state('default.products', {
            abstract: false,
            url: 'product',
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

},{}],6:[function(require,module,exports){

require('./modules/validators');
require('./modules/directives');
require('./modules/filters');

(function () {
    "use strict";
    angular.module('clouddecor.common', ['clouddecor.validators', 'clouddecor.filters' ,'clouddecor.directives']);
})();
},{"./modules/directives":10,"./modules/filters":14,"./modules/validators":18}],7:[function(require,module,exports){
 
//  load common modules
require('./clouddecor-common');

// Export namespace
module.exports = 'clouddecor.common';
},{"./clouddecor-common":6}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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


},{"./access_level":8,"./diff":9,"./sticky":11,"./tab-change":12}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){

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
},{}],13:[function(require,module,exports){
angular
    .module('cloudDecor.filters.capitalize', [])
    .filter('capitalize', capitalize);

function capitalize() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
}

},{}],14:[function(require,module,exports){
require('./capitalize');
require('./languageSplit');


(function () {
    "use strict";
    angular.module('clouddecor.filters', [
        'cloudDecor.filters.capitalize',
        'cloudDecor.filters.language_split'
    ]);
})();
},{"./capitalize":13,"./languageSplit":15}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

 
},{}],18:[function(require,module,exports){
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


},{"./alphaNumeric":16,"./email":17,"./integer":19,"./match":20,"./number":21,"./resetParse":22,"./unique":23}],19:[function(require,module,exports){
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



},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){

angular.module('sa-hack.controllers.HeaderController', [])
    .controller('HeaderController', HeaderController);

function HeaderController($scope){
    $scope.title = "SA";
}
},{}],25:[function(require,module,exports){

require("./HeaderController");

angular.module('sa-hack.controllers', ['sa-hack.controllers.HeaderController']);

module.exports = 'sa-hack.controllers';
},{"./HeaderController":24}],26:[function(require,module,exports){


angular.module('sa-hack.directives', []);

module.exports = 'sa-hack.directives';
},{}],27:[function(require,module,exports){
require('./controllers');
require('./directives');
require('./services');
require('./validators');

(function () {
    "use strict";
    angular.module('sa-hack.shared', ['sa-hack.validators', 'sa-hack.directives', 'sa-hack.services', 'sa-hack.controllers']);
})();

module.exports = 'sa-hack.shared';
},{"./controllers":25,"./directives":26,"./services":29,"./validators":33}],28:[function(require,module,exports){

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



},{}],29:[function(require,module,exports){

require('./commonService');
require('./userService');

angular.module('sa-hack.services', ['sa-hack.controllers.CommonService','sa-hack.controllers.UserService']);

module.exports = 'sa-hack.services';
},{"./commonService":28,"./userService":30}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){


angular.module('sa-hack.validators', []);

module.exports = 'sa-hack.validators';
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvbW9kdWxlcy9jYXJ0L2NhcnQuanMiLCJzcmMvYXBwL21vZHVsZXMvZGVtby9jb250cm9sbGVycy9kZW1vQ29udHJvbGxlci5qcyIsInNyYy9hcHAvbW9kdWxlcy9kZW1vL2RlbW8ucm91dGluZy5qcyIsInNyYy9hcHAvbW9kdWxlcy9wcm9kdWN0cy9wcm9kdWN0LmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL2Nsb3VkZGVjb3ItY29tbW9uLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL2luZGV4LmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvZGlyZWN0aXZlcy9hY2Nlc3NfbGV2ZWwuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy9kaXJlY3RpdmVzL2RpZmYuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy9kaXJlY3RpdmVzL2luZGV4LmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvZGlyZWN0aXZlcy9zdGlja3kuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy9kaXJlY3RpdmVzL3RhYi1jaGFuZ2UuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy9maWx0ZXJzL2NhcGl0YWxpemUuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy9maWx0ZXJzL2luZGV4LmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvZmlsdGVycy9sYW5ndWFnZVNwbGl0LmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvdmFsaWRhdG9ycy9hbHBoYU51bWVyaWMuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy92YWxpZGF0b3JzL2VtYWlsLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvdmFsaWRhdG9ycy9pbmRleC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL3ZhbGlkYXRvcnMvaW50ZWdlci5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL3ZhbGlkYXRvcnMvbWF0Y2guanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy92YWxpZGF0b3JzL251bWJlci5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL3ZhbGlkYXRvcnMvcmVzZXRQYXJzZS5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL3ZhbGlkYXRvcnMvdW5pcXVlLmpzIiwic3JjL2FwcC9zaGFyZWQvY29udHJvbGxlcnMvSGVhZGVyQ29udHJvbGxlci5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwic3JjL2FwcC9zaGFyZWQvZGlyZWN0aXZlcy9pbmRleC5qcyIsInNyYy9hcHAvc2hhcmVkL2luZGV4LmpzIiwic3JjL2FwcC9zaGFyZWQvc2VydmljZXMvY29tbW9uU2VydmljZS5qcyIsInNyYy9hcHAvc2hhcmVkL3NlcnZpY2VzL2luZGV4LmpzIiwic3JjL2FwcC9zaGFyZWQvc2VydmljZXMvdXNlclNlcnZpY2UuanMiLCJzcmMvYXBwL3NoYXJlZC91dGlscy9jb25zdGFudHMuanMiLCJzcmMvYXBwL3NoYXJlZC91dGlscy9tZXNzYWdlcy5qcyIsInNyYy9hcHAvc2hhcmVkL3ZhbGlkYXRvcnMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnJlcXVpcmUoJy4vc2hhcmVkL2NvbW1vbicpO1xucmVxdWlyZSgnLi9zaGFyZWQnKTtcblxuXG5cblxucmVxdWlyZSgnLi9tb2R1bGVzL2RlbW8vZGVtby5yb3V0aW5nJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvcHJvZHVjdHMvcHJvZHVjdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NhcnQvY2FydCcpO1xuXG4vKipcbiAqIEVOVlxuICovXG52YXIgJGdsb2JhbCA9IHJlcXVpcmUoJy4vc2hhcmVkL3V0aWxzL2NvbnN0YW50cy5qcycpO1xudmFyICRtZXNzYWdlID0gcmVxdWlyZSgnLi9zaGFyZWQvdXRpbHMvbWVzc2FnZXMuanMnKTtcblxuXG52YXIgYXBwID0gYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NhLWhhY2snLCBbXG5cbiAgICAgICAgJ2Nsb3VkZGVjb3IuY29tbW9uJyxcbiAgICAgICAgJ3NhLWhhY2suc2hhcmVkJyxcbiAgICAgICBcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tIE5vZGUgbW9kdWxlcyAtLS0tLS0tLS0tLS0vL1xuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ25nTWF0ZXJpYWwnLFxuICAgICAgICAnbmdNZXNzYWdlcycsXG4gICAgICAgICduZ0Nvb2tpZXMnLFxuICAgICAgICAncGFnZXNsaWRlLWRpcmVjdGl2ZScsXG4gICAgICAgICdhbmltLWluLW91dCcsXG4gICAgICAgICd1aS5zZWxlY3QnLFxuICAgICAgICAnbmdTYW5pdGl6ZScsXG4gICAgICAgICd0b2FzdHInLFxuICAgICAgICAndkFjY29yZGlvbicsXG4gICAgICAgICduZ0FuaW1hdGUnLFxuICAgICAgICAnY2hlY2tsaXN0LW1vZGVsJyxcbiAgICAgICAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuICAgICAgICAnc24uc2tyb2xscicsXG4gICAgICAgICdqa0FuZ3VsYXJDYXJvdXNlbCcsXG4gICAgICAgICdjaGVja2xpc3QtbW9kZWwnLFxuICAgICAgICAncnpNb2R1bGUnLFxuICAgICAgICAnbmdNYXRlcmlhbERhdGVQaWNrZXInLFxuXG4vLy0tYXBwIG1vZHVsZXMtLS8vXG4gICAgICAgICdzYS1oYWNrLmRlbW8nLFxuICAgICAgICAnc2EtaGFjay5wcm9kdWN0cycsXG4gICAgICAgICdzYS1oYWNrLmNhcnQnXG4gICAgXSk7XG5hcHAuXG4gICAgY29uZmlnKFtcIiR1cmxSb3V0ZXJQcm92aWRlclwiLCBcIiRzdGF0ZVByb3ZpZGVyXCIsIFwic25Ta3JvbGxyUHJvdmlkZXJcIiwgXCJ0b2FzdHJDb25maWdcIiwgXCJjZnBMb2FkaW5nQmFyUHJvdmlkZXJcIiwgY29uZmlnRnVuY3Rpb25dKVxuICAgIC5jb25zdGFudChcIiRnbG9iYWxcIiwgJGdsb2JhbClcbiAgICAuY29uc3RhbnQoXCIkbWVzc2FnZVwiLCAkbWVzc2FnZSlcbiAgICAucnVuKHJ1bik7XG5cbmZ1bmN0aW9uIGNvbmZpZ0Z1bmN0aW9uKCR1cmxSb3V0ZXJQcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsIHNuU2tyb2xsclByb3ZpZGVyLCB0b2FzdHJDb25maWcsIGNmcExvYWRpbmdCYXJQcm92aWRlcikge1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xuICAgIC8vIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlO1xuXG5cbiAgICAvL01haW4gUm91dGluZ1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnZGVmYXVsdCcsIHtcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgdXJsOlwiL1wiLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvc2hhcmVkL3ZpZXdzL2RlZmF1bHQtbGF5b3V0Lmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvZGVtbycpO1xuXG4gICAgc25Ta3JvbGxyUHJvdmlkZXIuY29uZmlnID0geyBzbW9vdGhTY3JvbGxpbmc6IHRydWUgfTtcblxuICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICBhdXRvRGlzbWlzczogZmFsc2UsXG4gICAgICAgIGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcbiAgICAgICAgbWF4T3BlbmVkOiAwLFxuICAgICAgICBuZXdlc3RPblRvcDogdHJ1ZSxcbiAgICAgICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LXRvcC1mdWxsLXdpZHRoJyxcbiAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgICAgY2xvc2VCdXR0b246IHRydWVcbiAgICB9KTtcbn1cblxuXG5cbmZ1bmN0aW9uIHJ1bihcbiAgICAkcm9vdFNjb3BlLFxuICAgICRodHRwLFxuICAgICRjb29raWVzLFxuICAgIHRvYXN0cixcbiAgICBzblNrcm9sbHIsXG4gICAgJHN0YXRlLFxuICAgIENvbW1vblNlcnZpY2Vcbikge1xuXG5cbiAgICBDb21tb25TZXJ2aWNlLmxvZyhcImFwcCBXb3Jrc1wiKTtcbiAgICBcbiAgIFxuLy8kc3RhdGUuZ28oJ2RlZmF1bHQuZGVtbycpO1xufVxuIiwiXG5hbmd1bGFyLm1vZHVsZSgnc2EtaGFjay5jYXJ0JywgW10pXG4gICAgLmNvbmZpZyhjb25maWcpXG4gICAgLmNvbnRyb2xsZXIoJ0NhcnRDb250cm9sbGVyJyxDYXJ0Q29udHJvbGxlcik7XG5cblxuZnVuY3Rpb24gY29uZmlnKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgLy9Sb3V0aW5nXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdkZWZhdWx0LmNhcnQnLCB7XG4gICAgICAgICAgICBhYnN0cmFjdDogZmFsc2UsXG4gICAgICAgICAgICB1cmw6IFwiY2FydFwiLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL21vZHVsZXMvY2FydC9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2FydENvbnRyb2xsZXIgYXMgdm0nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuXG5mdW5jdGlvbiBDYXJ0Q29udHJvbGxlcigpe1xuICAgIGNvbnNvbGUubG9nKFwiQ2FydCBTdGFydFwiKTtcbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdzYS1oYWNrLmRlbW8uZGVtb0NvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignRGVtb0NvbnRyb2xsZXInLCBEZW1vQ29udHJvbGxlcik7XG5cblxuZnVuY3Rpb24gRGVtb0NvbnRyb2xsZXIoQ29tbW9uU2VydmljZSkge1xuICAgIENvbW1vblNlcnZpY2UubG9nKFwiZGVtbyB3b3Jrc1wiKTtcbn1cbiIsIlxucmVxdWlyZSgnLi9jb250cm9sbGVycy9kZW1vQ29udHJvbGxlcicpO1xuXG5hbmd1bGFyLm1vZHVsZSgnc2EtaGFjay5kZW1vJywgWydzYS1oYWNrLmRlbW8uZGVtb0NvbnRyb2xsZXInXSlcbiAgICAuY29uZmlnKGNvbmZpZyk7XG5cblxuZnVuY3Rpb24gY29uZmlnKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgLy9Sb3V0aW5nXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdkZWZhdWx0LmRlbW8nLCB7XG4gICAgICAgICAgICBhYnN0cmFjdDogZmFsc2UsXG4gICAgICAgICAgICB1cmw6IFwiZGVtb1wiLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL21vZHVsZXMvZGVtby92aWV3cy9kZW1vLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGVtb0NvbnRyb2xsZXIgYXMgdm0nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn1cblxuIiwiXG5hbmd1bGFyLm1vZHVsZSgnc2EtaGFjay5wcm9kdWN0cycsIFtdKVxuICAgIC5jb25maWcoY29uZmlnKVxuICAgIC5jb250cm9sbGVyKCdQcm9kdWN0Q29udHJvbGxlcicsUHJvZHVjdENvbnRyb2xsZXIpO1xuXG5cbmZ1bmN0aW9uIGNvbmZpZygkc3RhdGVQcm92aWRlcikge1xuICAgIC8vUm91dGluZ1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnZGVmYXVsdC5wcm9kdWN0cycsIHtcbiAgICAgICAgICAgIGFic3RyYWN0OiBmYWxzZSxcbiAgICAgICAgICAgIHVybDogJ3Byb2R1Y3QnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL21vZHVsZXMvcHJvZHVjdHMvcHJvZHVjdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDb250cm9sbGVyIGFzIHZtJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59XG5cblxuZnVuY3Rpb24gUHJvZHVjdENvbnRyb2xsZXIoKXtcbiAgICBjb25zb2xlLmxvZyhcInNhZHNhXCIpO1xufVxuIiwiXG5yZXF1aXJlKCcuL21vZHVsZXMvdmFsaWRhdG9ycycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2RpcmVjdGl2ZXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9maWx0ZXJzJyk7XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2Nsb3VkZGVjb3IuY29tbW9uJywgWydjbG91ZGRlY29yLnZhbGlkYXRvcnMnLCAnY2xvdWRkZWNvci5maWx0ZXJzJyAsJ2Nsb3VkZGVjb3IuZGlyZWN0aXZlcyddKTtcbn0pKCk7IiwiIFxuLy8gIGxvYWQgY29tbW9uIG1vZHVsZXNcbnJlcXVpcmUoJy4vY2xvdWRkZWNvci1jb21tb24nKTtcblxuLy8gRXhwb3J0IG5hbWVzcGFjZVxubW9kdWxlLmV4cG9ydHMgPSAnY2xvdWRkZWNvci5jb21tb24nOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbG91ZERlY29yLmRpcmVjdGl2ZS5hY2Nlc3MtbGV2ZWwnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdhY2Nlc3NMZXZlbCcsIGFjY2Vzc0xldmVsKTtcblxuZnVuY3Rpb24gYWNjZXNzTGV2ZWwodXNlclNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgdmFyIGFjY2Vzc0xldmVsO1xuICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUoJ2FjY2Vzc0xldmVsJywgZnVuY3Rpb24gKGFjbCkge1xuICAgICAgICAgICAgICAgIGlmIChhY2wpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzTGV2ZWwgPSBhY2w7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUNzcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVDc3MoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjY2Vzc0xldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdXNlclNlcnZpY2UuaXNBdXRob3JpemVkKGFjY2Vzc0xldmVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChlbGVtZW50WzBdLm5vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkFcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJJTlBVVFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJCVVRUT05cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0iLCIvKipcbiogQGRlc2MgdGhpcyBkaXJlY3RpdmUgaXMgZm9yIGNoZWNrIHRoZSBkaWZmZXJlbmNlIG9mIHR3byBlbGVtZW50cyBhbmQgYXBwbHkgYSBjc3MgY2xhc3MgdG8gc2hvdyB0aGUgZGlmZmVyZW5jZVxuKiBAZXhhbXBsZSA8aW5wdXQgZGlmZj1cInVzZXIubmFtZVwiPjwvaW5wdXQ+XG4qL1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnY2xvdWREZWNvci5kaXJlY3RpdmUuZGlmZicsW10pXG4gICAgLmRpcmVjdGl2ZSgnZGlmZicsIGRpZmYpO1xuXG5mdW5jdGlvbiBkaWZmKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoc2NvcGUudm0uZWRpdGVkVmlldyl7XG4gICAgICAgICAgICAgICAgdmFyIGFycmF5ID0gYXR0cmlidXRlcy5kaWZmLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgbmV3X3ZhbCA9IHNjb3BlLnZtLm5ld1ZlcnNpb247XG4gICAgICAgICAgICAgICAgdmFyIG9sZF92YWwgPSBzY29wZS52bS5vbGRWZXJzaW9uO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhcnJheSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3X3ZhbCA9IG5ld192YWxbaV07XG4gICAgICAgICAgICAgICAgICAgIG9sZF92YWwgPSBvbGRfdmFsW2ldO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCFhbmd1bGFyLmVxdWFscyhuZXdfdmFsLCBvbGRfdmFsKSl7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2RpZmYnKTtcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgIH1cbiAgICB9O1xufSIsInJlcXVpcmUoJy4vYWNjZXNzX2xldmVsJyk7XG5yZXF1aXJlKCcuL2RpZmYnKTsgXG5yZXF1aXJlKCcuL3N0aWNreScpO1xucmVxdWlyZSgnLi90YWItY2hhbmdlJyk7XG4gXG4oZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdjbG91ZGRlY29yLmRpcmVjdGl2ZXMnLCBbXG4gICAgICAgICdjbG91ZERlY29yLmRpcmVjdGl2ZS5hY2Nlc3MtbGV2ZWwnLFxuICAgICAgICAnY2xvdWREZWNvci5kaXJlY3RpdmUuZGlmZicsIFxuICAgICAgICAnY2xvdWREZWNvci5kaXJlY3RpdmUudGFiLWNoYW5nZScgXG4gICAgXSk7XG59KSgpO1xuXG4iLCIoZnVuY3Rpb24gKG5hbWVzcGFjZSkge1xuICAgIC8vIHNldCBzdGlja3kgbW9kdWxlIGFuZCBkaXJlY3RpdmVcbiAgICBhbmd1bGFyLm1vZHVsZShuYW1lc3BhY2UsIFtdKS5kaXJlY3RpdmUobmFtZXNwYWNlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGFuZ3VsYXJFbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhclxuICAgICAgICAgICAgICAgIC8vIGdldCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBhbmd1bGFyRWxlbWVudFswXSxcblxuICAgICAgICAgICAgICAgIC8vIGdldCBkb2N1bWVudFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudCA9IGVsZW1lbnQub3duZXJEb2N1bWVudCxcblxuICAgICAgICAgICAgICAgIC8vIGdldCB3aW5kb3dcbiAgICAgICAgICAgICAgICAgICAgd2luZG93ID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcsXG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnc3R5bGUnKSxcblxuICAgICAgICAgICAgICAgIC8vIGdldCBvcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbSA9IHBhcnNlRmxvYXQoYXR0cnNbbmFtZXNwYWNlICsgJ0JvdHRvbSddKSxcbiAgICAgICAgICAgICAgICAgICAgbWVkaWEgPSB3aW5kb3cubWF0Y2hNZWRpYShhdHRyc1tuYW1lc3BhY2UgKyAnTWVkaWEnXSB8fCAnYWxsJyksXG4gICAgICAgICAgICAgICAgICAgIHRvcCA9IHBhcnNlRmxvYXQoYXR0cnNbbmFtZXNwYWNlICsgJ1RvcCddKSxcblxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemUgc3RhdGVzXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUJvdHRvbSA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVUb3AgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0ge307XG5cbiAgICAgICAgICAgICAgICAvLyBjb25maWd1cmUgd3JhcHBlclxuICAgICAgICAgICAgICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ2lzLScgKyBuYW1lc3BhY2U7XG5cbiAgICAgICAgICAgICAgICAvLyBhY3RpdmF0ZSBzdGlja3lcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IGVsZW1lbnQgY29tcHV0ZWQgc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgdmFyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gYWN0aXZlVG9wID8gJ3RvcDonICsgdG9wIDogJ2JvdHRvbTonICsgYm90dG9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IGVsZW1lbnQucGFyZW50Tm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTaWJsaW5nID0gZWxlbWVudC5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgICAgICAvLyByZXBsYWNlIGVsZW1lbnQgd2l0aCB3cmFwcGVyIGNvbnRhaW5pbmcgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBuZXh0U2libGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZSB3cmFwcGVyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OicgKyBjb21wdXRlZFN0eWxlLmRpc3BsYXkgKyAnO2hlaWdodDonICsgZWxlbWVudC5vZmZzZXRIZWlnaHQgKyAncHg7bWFyZ2luOicgKyBjb21wdXRlZFN0eWxlLm1hcmdpbiArICc7d2lkdGg6JyArIGVsZW1lbnQub2Zmc2V0V2lkdGggKyAncHgnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdsZWZ0OicgKyBvZmZzZXQubGVmdCArICdweDttYXJnaW46MDtwb3NpdGlvbjpmaXhlZDt0cmFuc2l0aW9uOm5vbmU7JyArIHBvc2l0aW9uICsgJ3B4O3dpZHRoOicgKyBjb21wdXRlZFN0eWxlLndpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkZWFjdGl2YXRlIHN0aWNreVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHdyYXBwZXIucGFyZW50Tm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTaWJsaW5nID0gd3JhcHBlci5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgICAgICAvLyByZXBsYWNlIHdyYXBwZXIgd2l0aCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQod3JhcHBlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWxlbWVudCwgbmV4dFNpYmxpbmcpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVuc3R5bGUgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICBpZiAoc3R5bGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgc3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdW5zdHlsZSB3cmFwcGVyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZVRvcCA9IGFjdGl2ZUJvdHRvbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdyBzY3JvbGwgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvbnNjcm9sbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgYWN0aXZhdGVkXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVUb3AgfHwgYWN0aXZlQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgd3JhcHBlciBvZmZzZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldCA9IHdyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUJvdHRvbSA9ICFpc05hTihib3R0b20pICYmIG9mZnNldC50b3AgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSBib3R0b20gLSB3cmFwcGVyLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVRvcCA9ICFpc05hTih0b3ApICYmIG9mZnNldC50b3AgPCB0b3A7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlYWN0aXZhdGUgaWYgd3JhcHBlciBpcyBpbnNpZGUgcmFuZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYWN0aXZlVG9wICYmICFhY3RpdmVCb3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgbm90IGFjdGl2YXRlZFxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtZWRpYS5tYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgZWxlbWVudCBvZmZzZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUJvdHRvbSA9ICFpc05hTihib3R0b20pICYmIG9mZnNldC50b3AgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSBib3R0b20gLSBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVRvcCA9ICFpc05hTih0b3ApICYmIG9mZnNldC50b3AgPCB0b3A7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFjdGl2YXRlIGlmIGVsZW1lbnQgaXMgb3V0c2lkZSByYW5nZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVRvcCB8fCBhY3RpdmVCb3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gd2luZG93IHJlc2l6ZSBsaXN0ZW5lclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9ucmVzaXplKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25kaXRpb25hbGx5IGRlYWN0aXZhdGUgc3RpY2t5XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVUb3AgfHwgYWN0aXZlQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyByZS1pbml0aWFsaXplIHN0aWNreVxuICAgICAgICAgICAgICAgICAgICBvbnNjcm9sbCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRlc3Ryb3kgbGlzdGVuZXJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvbmRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ucmVzaXplKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIG9uc2Nyb2xsKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9ucmVzaXplKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBiaW5kIGxpc3RlbmVyc1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvbnNjcm9sbCk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9ucmVzaXplKTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBvbmRlc3Ryb3kpO1xuXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSBzdGlja3lcbiAgICAgICAgICAgICAgICBvbnNjcm9sbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xufSkoJ3N0aWNreScpOyIsIlxuLyoqXG4qIEBkZXNjIHRhYiBjaGFuZ2UgZGlyZWN0aXZlIGlzIHRvIGNoYW5nZSB0YWIgaW5kZXggdXBvbiBhIHNlcGVyYXRlIGV2ZW50KGJ1dHRvbikgY2xpY2tcbiogQGV4YW1wbGUgPGJ1dHRvbiB0YWItY2hhbmdlIHRhYnM9XCJbbnVtYmVyIG9mIHRhYnNdXCI+PC9idXR0b24+XG4qL1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnY2xvdWREZWNvci5kaXJlY3RpdmUudGFiLWNoYW5nZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ3RhYkNoYW5nZScsIHRhYkNoYW5nZSk7XG5cbmZ1bmN0aW9uIHRhYkNoYW5nZSgkbG9jYXRpb24sICRhbmNob3JTY3JvbGwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcblxuICAgICAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWxpYXMgPSBhdHRyaWJ1dGVzLmFsaWFzIHx8IFwidm1cIjtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFRhYkluZGV4ID0gYXR0cmlidXRlcy50YWJzID8gYXR0cmlidXRlcy50YWJzIC0gMSA6IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RUYWJJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZVthbGlhc10uc2VsZWN0ZWRJbmRleCA9IChzY29wZVthbGlhc10uc2VsZWN0ZWRJbmRleCA9PT0gbGFzdFRhYkluZGV4KSA/IDAgOiBzY29wZVthbGlhc10uc2VsZWN0ZWRJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgICAgIGlmICgkbG9jYXRpb24uaGFzaCgpICE9PSBcImZvcm0tdGFiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLmhhc2goXCJmb3JtLXRhYlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgaW5pdCk7XG4gICAgICAgIH1cbiAgICB9O1xufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbG91ZERlY29yLmZpbHRlcnMuY2FwaXRhbGl6ZScsIFtdKVxuICAgIC5maWx0ZXIoJ2NhcGl0YWxpemUnLCBjYXBpdGFsaXplKTtcblxuZnVuY3Rpb24gY2FwaXRhbGl6ZSgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuICghIWlucHV0KSA/IGlucHV0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCkgOiAnJztcbiAgICB9O1xufVxuIiwicmVxdWlyZSgnLi9jYXBpdGFsaXplJyk7XG5yZXF1aXJlKCcuL2xhbmd1YWdlU3BsaXQnKTtcblxuXG4oZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdjbG91ZGRlY29yLmZpbHRlcnMnLCBbXG4gICAgICAgICdjbG91ZERlY29yLmZpbHRlcnMuY2FwaXRhbGl6ZScsXG4gICAgICAgICdjbG91ZERlY29yLmZpbHRlcnMubGFuZ3VhZ2Vfc3BsaXQnXG4gICAgXSk7XG59KSgpOyIsIi8qKlxuICogVGhpcyBmaWx0ZXIgcmVtb3ZlIGNvdW50cnkgY29kZSBmcm9tIGxhbmd1YWdlIGNvZGVcbiAqL1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2Nsb3VkRGVjb3IuZmlsdGVycy5sYW5ndWFnZV9zcGxpdCcsIFtdKVxuICAgIC5maWx0ZXIoJ2xhbmd1YWdlU3BsaXQnLCBsYW5ndWFnZVNwbGl0KTtcblxuZnVuY3Rpb24gbGFuZ3VhZ2VTcGxpdCgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgYW5ndWxhci5pc0RlZmluZWQoaW5wdXQpICYmXG4gICAgICAgICAgICBpbnB1dCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgaW5wdXQgIT09ICcnICYmXG4gICAgICAgICAgICBpbnB1dC5zZWFyY2goJy0nKSAhPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCIvKipcbiogQGRlc2MgYWxwaGEgbnVtZXJpYyBWYWwgZGlyZWN0aXZlIGlzIHRvIHZhbGlkYXRlIGFscGhhbmV1bWVyaWMgdmFsdWVzIHByb3ZpZGVkIHdpdGggdGhlIFVJXG4qIEBleGFtcGxlIDxpbnB1dCBhbHBoYS1udW1lcmljLXZhbD1cIkRPVCwgU0lOR0xFLVFVT1RFLCBTTEFTSFwiPjwvaW5wdXQ+XG4qL1xuXG5hbmd1bGFyLm1vZHVsZSgnY2xvdWREZWNvci52YWxpZGF0b3JzLmFscGhhTnVtZXJpYycsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2FscGhhTnVtZXJpY1ZhbCcsIGFscGhhTnVtZXJpY1ZhbCk7XG5cbmZ1bmN0aW9uIGFscGhhTnVtZXJpY1ZhbCgkZ2xvYmFsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgUkVHRVhfU1RSSU5HID0gJyc7XG4gICAgICAgICAgICB2YXIgdmFsaWRfY2hhcmFjdGVycyA9IGF0dHJzLmFscGhhTnVtZXJpY1ZhbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRnbG9iYWwuQ0hBUkFDVEVSUywgZnVuY3Rpb24gKGNoYXJhY3RlciwgbGFiZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIHZhbGlkX2NoYXJhY3RlcnMuaW5kZXhPZihsYWJlbCkgPiAtMSApe1xuICAgICAgICAgICAgICAgICAgICBSRUdFWF9TVFJJTkcgPSBSRUdFWF9TVFJJTkcgKyBjaGFyYWN0ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFJFR0VYX1NUUklORyA9IG5ldyBSZWdFeHAoJ1teYS16QS1aMC05JyArIFJFR0VYX1NUUklORyArICddJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWwgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2xlYW4gPSB2YWwucmVwbGFjZShSRUdFWF9TVFJJTkcsICcnKTtcblxuICAgICAgICAgICAgICAgIGlmIChjbGVhbiAhPT0gdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoY2xlYW4pO1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiYW5ndWxhci5tb2R1bGUoJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5lbWFpbCcsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2VtYWlsVmFsJywgZW1haWxWYWwpO1xuXG5mdW5jdGlvbiBlbWFpbFZhbCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRycywgY3RybCkge1xuICAgICAgICAgICAgLy8gb25seSBhcHBseSB0aGUgdmFsaWRhdG9yIGlmIG5nTW9kZWwgaXMgcHJlc2VudCBhbmQgQW5ndWxhciBoYXMgYWRkZWQgdGhlIGVtYWlsIHZhbGlkYXRvclxuICAgICAgICAgICAgaWYgKGN0cmwgJiYgY3RybC4kdmFsaWRhdG9ycy5lbWFpbCkge1xuICAgICAgICAgICAgICAgIHZhciBFTUFJTF9SRUdFWFAgPSAvXltfYS16QS1aMC05XSsoXFwuW19hLXpBLVowLTldKykqQFthLXpBLVowLTktXSsoXFwuW2EtekEtWjAtOS1dKykqKFxcLlthLXpdezIsNH0pJC87XG5cbiAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgb3ZlcndyaXRlIHRoZSBkZWZhdWx0IEFuZ3VsYXIgZW1haWwgdmFsaWRhdG9yXG4gICAgICAgICAgICAgICAgY3RybC4kdmFsaWRhdG9ycy5lbWFpbCA9IGZ1bmN0aW9uKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0cmwuJGlzRW1wdHkobW9kZWxWYWx1ZSkgfHwgRU1BSUxfUkVHRVhQLnRlc3QobW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbiAiLCJyZXF1aXJlKCcuL2FscGhhTnVtZXJpYycpO1xucmVxdWlyZSgnLi9lbWFpbCcpO1xucmVxdWlyZSgnLi9pbnRlZ2VyJyk7XG5yZXF1aXJlKCcuL21hdGNoJyk7XG5yZXF1aXJlKCcuL251bWJlcicpO1xucmVxdWlyZSgnLi9yZXNldFBhcnNlJyk7XG5yZXF1aXJlKCcuL3VuaXF1ZScpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdjbG91ZGRlY29yLnZhbGlkYXRvcnMnLCBbXG4gICAgICAgICdjbG91ZERlY29yLnZhbGlkYXRvcnMuYWxwaGFOdW1lcmljJyxcbiAgICAgICAgJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5lbWFpbCcsXG4gICAgICAgICdjbG91ZERlY29yLnZhbGlkYXRvcnMuaW50ZWdlcicsXG4gICAgICAgICdjbG91ZERlY29yLnZhbGlkYXRvcnMubWF0Y2gnLFxuICAgICAgICAnY2xvdWREZWNvci52YWxpZGF0b3JzLm51bWJlcicsXG4gICAgICAgICdjbG91ZERlY29yLnZhbGlkYXRvcnMucmVzZXRQYXJzZScsXG4gICAgICAgICdjbG91ZERlY29yLnZhbGlkYXRvcnMudW5pcXVlJ1xuICAgIF0pO1xufSkoKTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5pbnRlZ2VyJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnaW50ZWdlclZhbCcsIGludGVnZXJWYWwpO1xuXG5mdW5jdGlvbiBpbnRlZ2VyVmFsKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgIGlmICghbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsKSB8fCB2YWwgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNsZWFuID0gdmFsLnRvU3RyaW5nKCkucmVwbGFjZSgvW14wLTldL2csICcnKTtcblxuICAgICAgICAgICAgICAgIGlmIChjbGVhbiAhPT0gdmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoY2xlYW4pO1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsZWFuO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5cbiIsIi8qKlxuKiBAZGVzYyB0aGlzIGRpcmVjdGl2ZSBpcyBmb3IgbWF0Y2hpbmcgdHdvIHZhbHVlc1xuKiBAZXhhbXBsZSA8aW5wdXQgbWF0Y2g9XCJbbmctbW9kZWwgdG8gd2hpY2ggbmVlZHMgdG8gYmUgY29tcGFyZWQgdG9dXCI+PC9pbnB1dD5cbiovXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnY2xvdWREZWNvci52YWxpZGF0b3JzLm1hdGNoJyxbXSlcbiAgICAuZGlyZWN0aXZlKCdtYXRjaCcsIG1hdGNoKTtcblxuZnVuY3Rpb24gbWF0Y2goJHBhcnNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICAgICAgXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkgeyAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy5tYXRjaCkoc2NvcGUpID09PSBjdHJsLiRtb2RlbFZhbHVlO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24odmFsaWRpdHkpIHtcbiAgICAgICAgICAgICAgICBjdHJsLiRzZXRWYWxpZGl0eSgnbWF0Y2gnLCB2YWxpZGl0eSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgnY2xvdWREZWNvci52YWxpZGF0b3JzLm51bWJlcicsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ251bWJlclZhbCcsIG51bWJlclZhbCk7XG5cbmZ1bmN0aW9uIG51bWJlclZhbCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHZhbCkgfHwgdmFsID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjbGVhbiA9IHZhbC50b1N0cmluZygpLnJlcGxhY2UoL1teMC05XFwuXS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgdmFyIGRlY2ltYWxDaGVjayA9IGNsZWFuLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNVbmRlZmluZWQoZGVjaW1hbENoZWNrWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWNpbWFsQ2hlY2tbMV0gPSBkZWNpbWFsQ2hlY2tbMV0uc2xpY2UoMCwyKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW4gPSBkZWNpbWFsQ2hlY2tbMF0gKyAnLicgKyBkZWNpbWFsQ2hlY2tbMV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gY2xlYW4pIHtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShjbGVhbik7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW47XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWxlbWVudC5iaW5kKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5yZXNldFBhcnNlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgncmVzZXRQYXJzZScsIHJlc2V0UGFyc2UpO1xuXG5mdW5jdGlvbiByZXNldFBhcnNlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcywgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICB2YXIgZm9ybV9uYW1lID0gYXR0cmlidXRlcy5mb3JtX25hbWUgfHwgXCJwZF9mb3JtXCI7XG4gICAgICAgICAgICB2YXIgYWxpYXMgPSBhdHRyaWJ1dGVzLmFsaWFzIHx8IFwiam91cm5hbGlzdFwiO1xuXG5cblxuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMucHVzaChmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2NvcGVbYWxpYXNdW2Zvcm1fbmFtZV0uJHN1Ym1pdHRlZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBhdHRyaWJ1dGVzLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc191c2VyX2Vycm9yID0gYXR0cmlidXRlcy5yZXNldFBhcnNlO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGVbYWxpYXNdW2Zvcm1fbmFtZV1bZmllbGRdLiRzZXRWYWxpZGl0eSgncGFyc2UnLCB0cnVlLCBuZ01vZGVsQ3RybCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlW2FsaWFzXS5lcnJvcnMgJiYgaXNfdXNlcl9lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVbYWxpYXNdLmVycm9yc1tpc191c2VyX2Vycm9yXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiLyoqXG4qIEBkZXNjIHRoaXMgZGlyZWN0aXZlIGlzIGZvciBjaGVjayB0aGUgdW5pcXVlbmVzcyBhZ2FpbnN0IGdpdmVuIGFycmF5IG9mIG5nLW1vZGVsIHZhbHVlc1xuKiBAZXhhbXBsZSA8aW5wdXQgdW5pcXVlLWVtYWlsPVwibmctbW9kZWwxLCBuZy1tb2RlbDIuLi4uXCI+PC9pbnB1dD5cbiovXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbG91ZERlY29yLnZhbGlkYXRvcnMudW5pcXVlJyxbXSlcbiAgICAuZGlyZWN0aXZlKCd1bmlxdWUnLCB1bmlxdWUpO1xuXG5mdW5jdGlvbiB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICBpZiAoIW5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsdWU7XG5cbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWw7XG5cbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlcy51bmlxdWUgJiYgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZhbGlkaXR5KCdpc1VuaXF1ZUVtYWlsJywgaXNWYWxpZCgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gaXNWYWxpZCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IGF0dHJpYnV0ZXMudW5pcXVlLnJlcGxhY2UoL1tcXHNdKy9nLCAnJykuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uKGVtYWlsRmllbGQpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgZW1haWxWYWx1ZSA9ICQoXCJpbnB1dFtuYW1lPVwiKyBlbWFpbEZpZWxkICtcIl1cIikudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWxpZGl0eSA9IGdldFZhbGlkaXR5KGVtYWlsVmFsdWUsIGVtYWlsRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICBzZXRGaWVsZChlbWFpbEZpZWxkLCB2YWxpZGl0eSk7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsaWQgJiYgdmFsaWRpdHk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uKGZpZWxkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbWFpbEZpZWxkICE9PSBmaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc1ZhbGlkID0gKCgkKFwiaW5wdXRbbmFtZT1cIisgZmllbGQgK1wiXVwiKS52YWwoKSApICE9PSBlbWFpbFZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRGaWVsZChlbWFpbEZpZWxkLCBpc1ZhbGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RmllbGQoZmllbGQsIGlzVmFsaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFZhbGlkaXR5KGVtYWlsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHZhbHVlICE9PSBlbWFpbFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0RmllbGQoZW1haWxGaWVsZCwgdmFsaWRpdHkpIHtcbiAgICAgICAgICAgICAgICBzY29wZS52bS5jZF9mb3JtW2VtYWlsRmllbGRdLiRzZXRWYWxpZGl0eSgnaXNVbmlxdWVFbWFpbCcsIHZhbGlkaXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfTtcbn0iLCJcbmFuZ3VsYXIubW9kdWxlKCdzYS1oYWNrLmNvbnRyb2xsZXJzLkhlYWRlckNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignSGVhZGVyQ29udHJvbGxlcicsIEhlYWRlckNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBIZWFkZXJDb250cm9sbGVyKCRzY29wZSl7XG4gICAgJHNjb3BlLnRpdGxlID0gXCJTQVwiO1xufSIsIlxucmVxdWlyZShcIi4vSGVhZGVyQ29udHJvbGxlclwiKTtcblxuYW5ndWxhci5tb2R1bGUoJ3NhLWhhY2suY29udHJvbGxlcnMnLCBbJ3NhLWhhY2suY29udHJvbGxlcnMuSGVhZGVyQ29udHJvbGxlciddKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnc2EtaGFjay5jb250cm9sbGVycyc7IiwiXG5cbmFuZ3VsYXIubW9kdWxlKCdzYS1oYWNrLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3NhLWhhY2suZGlyZWN0aXZlcyc7IiwicmVxdWlyZSgnLi9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9kaXJlY3RpdmVzJyk7XG5yZXF1aXJlKCcuL3NlcnZpY2VzJyk7XG5yZXF1aXJlKCcuL3ZhbGlkYXRvcnMnKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnc2EtaGFjay5zaGFyZWQnLCBbJ3NhLWhhY2sudmFsaWRhdG9ycycsICdzYS1oYWNrLmRpcmVjdGl2ZXMnLCAnc2EtaGFjay5zZXJ2aWNlcycsICdzYS1oYWNrLmNvbnRyb2xsZXJzJ10pO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSAnc2EtaGFjay5zaGFyZWQnOyIsIlxuYW5ndWxhci5tb2R1bGUoJ3NhLWhhY2suY29udHJvbGxlcnMuQ29tbW9uU2VydmljZScsIFtdKVxuICAgIC5zZXJ2aWNlKCdDb21tb25TZXJ2aWNlJywgQ29tbW9uU2VydmljZSk7XG5cbmZ1bmN0aW9uIENvbW1vblNlcnZpY2UoKSB7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcbiAgICAgICAgbG9nOiBsb2dcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9naW4oKSB7XG4gICAgICAgIHZtLmxvZyhcImxvZ2luXCIpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgICAgICB2bS5sb2coXCJsb2dvdXRcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9nKHN0cikge1xuICAgICAgICBjb25zb2xlLmxvZyhzdHIpO1xuICAgIH1cblxuXG59XG5cblxuIiwiXG5yZXF1aXJlKCcuL2NvbW1vblNlcnZpY2UnKTtcbnJlcXVpcmUoJy4vdXNlclNlcnZpY2UnKTtcblxuYW5ndWxhci5tb2R1bGUoJ3NhLWhhY2suc2VydmljZXMnLCBbJ3NhLWhhY2suY29udHJvbGxlcnMuQ29tbW9uU2VydmljZScsJ3NhLWhhY2suY29udHJvbGxlcnMuVXNlclNlcnZpY2UnXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gJ3NhLWhhY2suc2VydmljZXMnOyIsImFuZ3VsYXIubW9kdWxlKCdzYS1oYWNrLmNvbnRyb2xsZXJzLlVzZXJTZXJ2aWNlJywgW10pXG4gICAgLnNlcnZpY2UoJ1VzZXJTZXJ2aWNlJywgVXNlclNlcnZpY2UpO1xuXG5mdW5jdGlvbiBVc2VyU2VydmljZSgpIHtcblxuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIGxvZ291dDogbG9nb3V0LFxuICAgICAgICBsb2c6IGxvZ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2dpbigpIHtcbiAgICAgICAgdm0ubG9nKFwibG9naW5cIik7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgIHZtLmxvZyhcImxvZ291dFwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2coc3RyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHN0cik7XG4gICAgfVxuXG5cbn0iLCJ2YXIgJGdsb2JhbCA9IHt9O1xuXG4kZ2xvYmFsLlNFQ1RJT04gPSAncHJlc3NkZWNvcic7XG4kZ2xvYmFsLklURU1TX1BFUl9QQUdFID0gJzIwJztcblxuLyoqXG4gKiBIVFRQIHJlc3BvbnNlIGNvZGVzXG4gKi9cbiRnbG9iYWwuSFRUUDIwMCA9IDIwMDtcbiRnbG9iYWwuSFRUUDIwMSA9IDIwMTtcbiRnbG9iYWwuSFRUUDIwNCA9IDIwNDtcbiRnbG9iYWwuSFRUUDQwMCA9IDQwMDtcbiRnbG9iYWwuSFRUUDQwMSA9IDQwMTtcbiRnbG9iYWwuSFRUUDQwMyA9IDQwMztcbiRnbG9iYWwuSFRUUDQwNCA9IDQwNDtcbiRnbG9iYWwuSFRUUDQyMiA9IDQyMjtcbiRnbG9iYWwuSFRUUDUwMCA9IDUwMDtcblxuLyoqXG4gKiBBbGVydCB0eXBlc1xuICovXG4kZ2xvYmFsLklORk8gPSAnaW5mbyc7XG4kZ2xvYmFsLkVSUk9SID0gJ2Vycm9yJztcbiRnbG9iYWwuU1VDQ0VTUyA9ICdzdWNjZXNzJztcbiRnbG9iYWwuV0FSTklORyA9ICd3YXJuaW5nJztcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKiogVXNlciAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbi8qKlxuICogQWN0aW9uIHR5cGVzXG4gKi9cbiRnbG9iYWwuQUNUSU9OUyA9IHtcbiAgICBBREQ6ICdhZGQnLFxuICAgIEVESVQ6ICdlZGl0J1xufTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKiogU3Vic2NyaXB0aW9uICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKipcbiAqIHNvbHV0aW9uIHR5cGVzXG4gKi9cbiRnbG9iYWwuU09MVVRJT05TID0ge1xuICAgIENMT1VEREVDT1I6ICdjbG91ZGRlY29yJyxcbiAgICBNQVJLRVRQTEFDRTogJ21hcmtldHBsYWNlJ1xufTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHJvZHVjdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuJGdsb2JhbC5DT0xPUl9WQVJJQU5UID0gJ2NvbG9yJztcblxuJGdsb2JhbC5DT0xPUlMgPSBbXG4gICAgeyAnY29kZSc6ICdlZDg0NzcnLCAnY2xhc3MnOiAnYmctMScgfSxcbiAgICB7ICdjb2RlJzogJ2QyNDAzNicsICdjbGFzcyc6ICdiZy0yJyB9LFxuICAgIHsgJ2NvZGUnOiAnYTUyNjE4JywgJ2NsYXNzJzogJ2JnLTMnIH0sXG4gICAgeyAnY29kZSc6ICdjMjRiMjEnLCAnY2xhc3MnOiAnYmctNCcgfSxcbiAgICB7ICdjb2RlJzogJzcwMjAxYycsICdjbGFzcyc6ICdiZy01JyB9LFxuICAgIHsgJ2NvZGUnOiAnZmJmMjk4JywgJ2NsYXNzJzogJ2JnLTYnIH0sXG4gICAgeyAnY29kZSc6ICdmYWRlNGInLCAnY2xhc3MnOiAnYmctNycgfSxcbiAgICB7ICdjb2RlJzogJ2Y1YmI0MScsICdjbGFzcyc6ICdiZy04JyB9LFxuICAgIHsgJ2NvZGUnOiAnZjJhNTNhJywgJ2NsYXNzJzogJ2JnLTknIH0sXG4gICAgeyAnY29kZSc6ICdlZTc5MmYnLCAnY2xhc3MnOiAnYmctMTAnIH0sXG4gICAgeyAnY29kZSc6ICdjMzRjMjEnLCAnY2xhc3MnOiAnYmctMTEnIH0sXG4gICAgeyAnY29kZSc6ICdmN2NkZjMnLCAnY2xhc3MnOiAnYmctMTInIH0sXG4gICAgeyAnY29kZSc6ICdhOTRjOGEnLCAnY2xhc3MnOiAnYmctMTMnIH0sXG4gICAgeyAnY29kZSc6ICc2ZDI4NTUnLCAnY2xhc3MnOiAnYmctMTQnIH0sXG4gICAgeyAnY29kZSc6ICczZDE2MjMnLCAnY2xhc3MnOiAnYmctMTUnIH0sXG4gICAgeyAnY29kZSc6ICc1MDJlMTUnLCAnY2xhc3MnOiAnYmctMTYnIH0sXG4gICAgeyAnY29kZSc6ICc2MDUzNDcnLCAnY2xhc3MnOiAnYmctMTcnIH0sXG4gICAgeyAnY29kZSc6ICdkMWYzYjYnLCAnY2xhc3MnOiAnYmctMTgnIH0sXG4gICAgeyAnY29kZSc6ICdjZGYzODEnLCAnY2xhc3MnOiAnYmctMTknIH0sXG4gICAgeyAnY29kZSc6ICc3OGM1NjInLCAnY2xhc3MnOiAnYmctMjAnIH0sXG4gICAgeyAnY29kZSc6ICc2MjkwNTUnLCAnY2xhc3MnOiAnYmctMjEnIH0sXG4gICAgeyAnY29kZSc6ICcyZTUwMjUnLCAnY2xhc3MnOiAnYmctMjInIH0sXG4gICAgeyAnY29kZSc6ICcyZTY3NjcnLCAnY2xhc3MnOiAnYmctMjMnIH0sXG4gICAgeyAnY29kZSc6ICdlMWZiZmUnLCAnY2xhc3MnOiAnYmctMjQnIH0sXG4gICAgeyAnY29kZSc6ICdkMGU4ZjInLCAnY2xhc3MnOiAnYmctMjUnIH0sXG4gICAgeyAnY29kZSc6ICc1YWEyYjAnLCAnY2xhc3MnOiAnYmctMjYnIH0sXG4gICAgeyAnY29kZSc6ICczZDhhYjInLCAnY2xhc3MnOiAnYmctMjcnIH0sXG4gICAgeyAnY29kZSc6ICcyOTNhNGUnLCAnY2xhc3MnOiAnYmctMjgnIH0sXG4gICAgeyAnY29kZSc6ICcxZTJkM2QnLCAnY2xhc3MnOiAnYmctMjknIH0sXG4gICAgeyAnY29kZSc6ICcxMzFiMjYnLCAnY2xhc3MnOiAnYmctMzAnIH0sXG4gICAgeyAnY29kZSc6ICcxMjEzMWEnLCAnY2xhc3MnOiAnYmctMzEnIH0sXG4gICAgeyAnY29kZSc6ICdhY2FjYWMnLCAnY2xhc3MnOiAnYmctMzInIH1cbl07XG5cbiRnbG9iYWwuUFJPRFVDVF9TQVZFID0gJ3NhdmUnO1xuJGdsb2JhbC5QUk9EVUNUX1NBVkVfRFJBRlQgPSAnc2F2ZV9kcmFmdCc7XG4kZ2xvYmFsLlBST0RVQ1RfRURJVCA9ICdlZGl0JztcbiRnbG9iYWwuUFJPRFVDVF9FRElUX0RSQUZUID0gJ2VkaXRfZHJhZnQnO1xuXG4kZ2xvYmFsLlBST0RVQ1RfSU1BR0UgPSAnaW1hZ2UnO1xuJGdsb2JhbC5QUk9EVUNUX05PVF9GT1VORCA9ICdQUkQwMDYnO1xuXG4vKioqKioqKiogU3BlY2lhbCBjaGFyYWN0ZXJzIHRvIHNldCBhcyBhbHBoYSBudW1lcmljIHZhbHVlcyAqKioqKioqKioqKioqL1xuJGdsb2JhbC5DSEFSQUNURVJTID0ge1xuICAgICdVTkRFUlNDT1JFJzogJ18nLFxuICAgICdDT01NQSc6ICcsJyxcbiAgICAnU1BBQ0UnOiAnICcsXG4gICAgJ0RPVCc6ICcuJyxcbiAgICAnU0xBU0gnOiAnLycsXG4gICAgJ0FNUEVSU0FORCc6ICcmJyxcbiAgICAnU0lOR0xFLVFVT1RFJzogJ1xcJycsXG4gICAgJ1FVT1RFJzogJ1wiJyxcbiAgICAnQVNURVJJU0snOiAnKicsXG4gICAgJ0FUJzogJ0AnLFxuICAgICdQTFVTJzogJysnLFxuICAgICdIQVNIJzogJyMnLFxuICAgICdRVUVTVElPTi1NQVJLJzogJz8nLFxuICAgICdIWVBIRU4nOiAnLSdcbn07XG5tb2R1bGUuZXhwb3J0cyA9ICRnbG9iYWw7IiwidmFyICRtZXNzYWdlID0ge307XG5cblxuLyoqXG4gKiBTdWNjZXNzIG1lc3NhZ2VzXG4gKi9cbiRtZXNzYWdlLlBPU1RfQURERURfU1VDQ0VTUyA9ICdQb3N0IGFkZGVkIHN1Y2Nlc3NmdWxseSc7XG4kbWVzc2FnZS5QT1NUX1VQREFURURfU1VDQ0VTUyA9ICdQb3N0IHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5JztcbiRtZXNzYWdlLlBPU1RfREVMRVRFRF9TVUNDRVNTID0gJ1Bvc3QgZGVsZXRlZCBzdWNjZXNzZnVsbHknO1xuXG4kbWVzc2FnZS5QUk9EVUNUX0FEREVEX1NVQ0NFU1MgPSAnUHJvZHVjdCBoYXMgYmVlbiBhZGRlZCc7XG4kbWVzc2FnZS5QUk9EVUNUX0RSQUZUX0FEREVEX1NVQ0NFU1MgPSAnUHJvZHVjdCBoYXMgYmVlbiBhZGRlZCBhcyBkcmFmdCc7XG4kbWVzc2FnZS5QUk9EVUNUX1VQREFURURfU1VDQ0VTUyA9ICdQcm9kdWN0IGhhcyBiZWVuIHVwZGF0ZWQnO1xuJG1lc3NhZ2UuUFJPRFVDVF9EUkFGVF9VUERBVEVEX1NVQ0NFU1MgPSAnUHJvZHVjdCBoYXMgYmVlbiB1cGRhdGVkIGFzIGRyYWZ0JztcbiRtZXNzYWdlLlBST0RVQ1RfTk9UX1VQREFURUQgPSAnTm90aGluZyBmb3IgdXBkYXRlJztcbiRtZXNzYWdlLlBST0RVQ1RfTk9UX0ZPVU5EX0VSUiA9ICdObyBQcm9kdWN0cyBmb3VuZCc7XG4kbWVzc2FnZS5QUk9EVUNUX0RPV05MT0FEX01BSUxfU1VDQ0VTUyA9IFwiTWFpbCBTZW50IFN1Y2Nlc3NmdWxseVwiO1xuJG1lc3NhZ2UuUFJPRFVDVF9ET1dOTE9BRF9FUlJPUiA9IFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuIFBsZWFzZSB0cnkgYWdhaW5cIjtcbiRtZXNzYWdlLlBST0RVQ1RfRE9XTkxPQURfSU1BR0VfRU1QVFkgPSBcIkF0bGVhc3Qgb25lIGltYWdlIHNob3VsZCBiZSBzZWxlY3RlZCB0byBkb3dubG9hZFwiO1xuLy9yZXRhaWxlclxuJG1lc3NhZ2UuUkVUQUlMRVJfQURERURfU1VDQ0VTUyA9ICdSZXRhaWxlciByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseSc7XG5cbi8vYWNjb3VudCBcbiRtZXNzYWdlLlJFVEFJTEVSX1VTRVJfQURERURfU1VDQ0VTUyA9ICdSZXRhaWxlciB1c2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSc7XG4kbWVzc2FnZS5SRVRBSUxFUl9VU0VSX0VESVRFRF9TVUNDRVNTID0gJ1JldGFpbGVyIHVzZXIgdXBkYXRlZCBzdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuUkVUQUlMRVJfRURJVEVEX1NVQ0NFU1MgPSAnUmV0YWlsZXIgdXBkYXRlZCBzdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuQUNDT1VOVF9JTUFHRV9VUExPQURfU1VDQ0VTUyA9IFwiUmV0YWlsZXIgc3RvcmUgaW1hZ2UgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5XCI7XG5cbi8vam91cm5hbGlzdFxuJG1lc3NhZ2UuSk9VUk5BTElTVF9VU0VSX0FEREVEX1NVQ0NFU1MgPSAnSm91cm5hbGlzdCB1c2VyIGFkZGVkIHN1Y2Nlc3NmdWxseSc7XG5cbi8vY3NvXG4kbWVzc2FnZS5QUk9EVUNUX0FDQ0VQVF9TVUNDRVNTID0gJ1Byb2R1Y3QgQWNjZXB0ZWQgU3VjY2Vzc2Z1bGx5JztcbiRtZXNzYWdlLlBST0RVQ1RfUkVKRUNUX1NVQ0NFU1MgPSAnUHJvZHVjdCBSZWplY3RlZCBTdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuUkVUQUlMRVJfQUNDRVBUX1NVQ0NFU1MgPSAnUmV0YWlsZXIgQWNjZXB0ZWQgU3VjY2Vzc2Z1bGx5JztcbiRtZXNzYWdlLlJFVEFJTEVSX1JFSkVDVF9TVUNDRVNTID0gJ1JldGFpbGVyIFJlamVjdGVkIFN1Y2Nlc3NmdWxseSc7XG5cbi8vYnJhbmRcbiRtZXNzYWdlLkJSQU5EX0FERF9TVUNDRVNTID0gJ0JyYW5kIGFkZGVkIHN1Y2Nlc3NmdWxseS4nO1xuJG1lc3NhZ2UuQlJBTkRfUFJPRklMRV9GRVRDSF9FUlJPUiA9IFwiQnJhbmQgbm90IGZvdW5kXCI7XG5cblxuLyoqXG4gKiBJbmZvcm1hdGlvbiBtZXNzYWdlc1xuICovXG4kbWVzc2FnZS5QT1NUX0xJU1RfRU1QVFlfSU5GTyA9ICdQb3N0cyBub3QgZm91bmQnO1xuJG1lc3NhZ2UuRk9STV9JTlZBTElEID0gJ1BsZWFzZSBlbnRlciBtYW5kYXRvcnkgZmllbGRzIHRvIHByb2NlZWQnO1xuXG4vL2FjY291bnRcbiRtZXNzYWdlLlJFVEFJTEVSX1VTRVJfRkVUQ0hfRVJST1IgPSAnUmV0YWlsZXIgdXNlcnMgbm90IGZvdW5kLic7XG4kbWVzc2FnZS5SRVRBSUxFUl9QUk9GSUxFX0ZFVENIX0VSUk9SID0gJ1JldGFpbGVyIHByb2ZpbGUgbm90IGZvdW5kLic7XG5cblxuXG4vKipcbiAqIEVycm9yIG1lc3NhZ2VzXG4gKi9cbi8vUFJPRFVDVF9ERVRBSUxfTEVBRF9GQUlMXG4kbWVzc2FnZS5IVFRQNTAwX0VSUk9SID0gJ1NvbWUgZXJyb3IgaGFzIG9jY3VycmVkLiBQbGVhc2UgdHJ5IGFnYWluJztcbiRtZXNzYWdlLk1BUktFVF9QTEFDRV9MSVNUX0VSUk9SID0gJ01hcmtldCBwbGFjZXMgbm90IGZvdW5kJztcbiRtZXNzYWdlLk1BUktFVF9QTEFDRV9BVFRSSUJVVEVTX0VSUk9SID0gJ01hcmtldCBwbGFjZXMgYXR0cmlidXRlcyBub3QgZm91bmQnO1xuJG1lc3NhZ2UuQ0FURUdPUllfRkVUQ0hfRVJST1IgPSAnQ2FuIG5vdCBmZXRjaCB0aGUgY2F0ZWdvcnknO1xuXG4kbWVzc2FnZS5DT1VOVFJZX0ZFVENIX0VSUk9SID0gJ0NvdW50cmllcyBub3QgZm91bmQuJztcbiRtZXNzYWdlLkNJVFlfRkVUQ0hfRVJST1IgPSAnQ2l0aWVzIG5vdCBmb3VuZC4nO1xuJG1lc3NhZ2UuUk9MRVNfRkVUQ0hfRVJST1IgPSAnVXNlciByb2xlcyBub3QgZm91bmQuJztcblxuJG1lc3NhZ2UuUFJPRFVDVF9OT1RfRk9VTkQgPSAnQWxsIHRoZSBwcm9kdWN0cyBoYXMgbG9hZGVkJztcbiRtZXNzYWdlLlBST0RVQ1Q0MDRfRVJST1IgPSAnU29ycnksIHRoZSByZXF1ZXN0ZWQgcHJvZHVjdCBpcyBub3QgYXZhaWxhYmxlJztcblxuLy9Qcm9kdWN0IEVkaXRcbiRtZXNzYWdlLlBST0RVQ1RfREVUQUlMX0xFQURfRkFJTCA9ICdTb21lIGVycm9yIGhhcyBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2Fpbic7XG5cbi8vYWNjb3VudFxuJG1lc3NhZ2UuQUNDT1VOVF9JTUFHRV9VUExPQURfRVJST1IgPSBcIlJldGFpbGVyIHN0b3JlIGltYWdlIHVwbG9hZCBlcnJvclwiO1xuJG1lc3NhZ2UuQ1VSUkVOQ1lfTElTVF9GRVRDSF9FUlJPUiA9IFwiQ2Fubm90IGZldGNoIGN1cnJlbmN5IGxpc3QuXCI7XG4kbWVzc2FnZS5DVVJSRU5DWV9GRVRDSF9FUlJPUiA9IFwiQ2Fubm90IGZldGNoIGN1cnJlbmN5IGNvZGUuXCI7XG5cbi8vc3Vic2NyaXB0aW9uXG4kbWVzc2FnZS5TVUJTQ1JJUFRJT05fUExBTl9GRVRDSF9FUlJPUiA9ICdTdWJzY3JpcHRpb24gcGxhbiBub3QgZm91bmQuJztcblxuLy9jc29cbiRtZXNzYWdlLlBST0RVQ1RfRkVUQ0hfRVJST1IgPSBcIlByb2R1Y3Qgbm90IGZvdW5kLlwiO1xuXG4vL3JldGFpbGVyXG4kbWVzc2FnZS5SRVRBSUxFUl9MSVNUX05PVF9GT1VORCA9IFwiUmV0YWlsZXIgUmVxdWVzdHMgbG9hZGluZyBlcnJvci5cIjtcblxuLy9icmFuZFxuJG1lc3NhZ2UuVVNFUl9ST0xFX05PVF9GT1VORCA9ICdVc2VyIFJvbGUgbm90IGZvdW5kLic7XG4kbWVzc2FnZS5GT1JNX0lOVkFMSUQgPSAnUGxlYXNlIGZpbGwgbWFuZG90b3J5IGZpZWxkcyB0byBwcm9jZWVkJztcblxuXG4vL0FDTFxuJG1lc3NhZ2UuVU5BVEhPUklaRUQgPSBcIllvdSBkb24ndCBoYXZlICByZXF1aXJlZCBwZXJtaXNzaW9ucy5cIjtcblxuXG5tb2R1bGUuZXhwb3J0cyA9ICRtZXNzYWdlOyIsIlxuXG5hbmd1bGFyLm1vZHVsZSgnc2EtaGFjay52YWxpZGF0b3JzJywgW10pO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICdzYS1oYWNrLnZhbGlkYXRvcnMnOyJdfQ==
