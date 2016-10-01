(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

 
require('./shared/common');

/**
 * ENV
 */
var $global = require('./shared/utils/constants.js');
var $message = require('./shared/utils/messages.js');

angular
    .module('pressDecor', [

        'clouddecor.common',
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
         
        //------------- App modules ------------//

         

    ])
    .config(["$urlRouterProvider", "$stateProvider", "snSkrollrProvider", "toastrConfig", "cfpLoadingBarProvider", configFunction])
    .constant("$global", $global)
    .constant("$message", $message)
    .run(run);

function configFunction($urlRouterProvider, $stateProvider, snSkrollrProvider, toastrConfig, cfpLoadingBarProvider) {
    $urlRouterProvider.otherwise("/");
    // cfpLoadingBarProvider.includeSpinner = false;


    //Main Routing
    $stateProvider
        .state('default', {
            abstract: false,
            url:"",
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
    $state
) {

     console.log("app works");
     $(document).ready(function(){
         console.log("fucl");
     });
   
}

},{"./shared/common":3,"./shared/utils/constants.js":20,"./shared/utils/messages.js":21}],2:[function(require,module,exports){

require('./modules/validators');
require('./modules/directives');
require('./modules/filters');

(function () {
    "use strict";
    angular.module('clouddecor.common', ['clouddecor.validators', 'clouddecor.filters' ,'clouddecor.directives']);
})();
},{"./modules/directives":6,"./modules/filters":10,"./modules/validators":14}],3:[function(require,module,exports){
 
//  load common modules
require('./clouddecor-common');

// Export namespace
module.exports = 'clouddecor.common';
},{"./clouddecor-common":2}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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


},{"./access_level":4,"./diff":5,"./sticky":7,"./tab-change":8}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){

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
},{}],9:[function(require,module,exports){
angular
    .module('cloudDecor.filters.capitalize', [])
    .filter('capitalize', capitalize);

function capitalize() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
}

},{}],10:[function(require,module,exports){
require('./capitalize');
require('./languageSplit');


(function () {
    "use strict";
    angular.module('clouddecor.filters', [
        'cloudDecor.filters.capitalize',
        'cloudDecor.filters.language_split'
    ]);
})();
},{"./capitalize":9,"./languageSplit":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

 
},{}],14:[function(require,module,exports){
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


},{"./alphaNumeric":12,"./email":13,"./integer":15,"./match":16,"./number":17,"./resetParse":18,"./unique":19}],15:[function(require,module,exports){
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



},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9jbG91ZGRlY29yLWNvbW1vbi5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9pbmRleC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL2RpcmVjdGl2ZXMvYWNjZXNzX2xldmVsLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvZGlyZWN0aXZlcy9kaWZmLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvZGlyZWN0aXZlcy9pbmRleC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL2RpcmVjdGl2ZXMvc3RpY2t5LmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvZGlyZWN0aXZlcy90YWItY2hhbmdlLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvZmlsdGVycy9jYXBpdGFsaXplLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvZmlsdGVycy9pbmRleC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL2ZpbHRlcnMvbGFuZ3VhZ2VTcGxpdC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL3ZhbGlkYXRvcnMvYWxwaGFOdW1lcmljLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvdmFsaWRhdG9ycy9lbWFpbC5qcyIsInNyYy9hcHAvc2hhcmVkL2NvbW1vbi9tb2R1bGVzL3ZhbGlkYXRvcnMvaW5kZXguanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy92YWxpZGF0b3JzL2ludGVnZXIuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy92YWxpZGF0b3JzL21hdGNoLmpzIiwic3JjL2FwcC9zaGFyZWQvY29tbW9uL21vZHVsZXMvdmFsaWRhdG9ycy9udW1iZXIuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy92YWxpZGF0b3JzL3Jlc2V0UGFyc2UuanMiLCJzcmMvYXBwL3NoYXJlZC9jb21tb24vbW9kdWxlcy92YWxpZGF0b3JzL3VuaXF1ZS5qcyIsInNyYy9hcHAvc2hhcmVkL3V0aWxzL2NvbnN0YW50cy5qcyIsInNyYy9hcHAvc2hhcmVkL3V0aWxzL21lc3NhZ2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4gXG5yZXF1aXJlKCcuL3NoYXJlZC9jb21tb24nKTtcblxuLyoqXG4gKiBFTlZcbiAqL1xudmFyICRnbG9iYWwgPSByZXF1aXJlKCcuL3NoYXJlZC91dGlscy9jb25zdGFudHMuanMnKTtcbnZhciAkbWVzc2FnZSA9IHJlcXVpcmUoJy4vc2hhcmVkL3V0aWxzL21lc3NhZ2VzLmpzJyk7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcmVzc0RlY29yJywgW1xuXG4gICAgICAgICdjbG91ZGRlY29yLmNvbW1vbicsXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLSBOb2RlIG1vZHVsZXMgLS0tLS0tLS0tLS0tLy9cbiAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICduZ01hdGVyaWFsJyxcbiAgICAgICAgJ25nTWVzc2FnZXMnLFxuICAgICAgICAnbmdDb29raWVzJyxcbiAgICAgICAgJ3BhZ2VzbGlkZS1kaXJlY3RpdmUnLFxuICAgICAgICAnYW5pbS1pbi1vdXQnLFxuICAgICAgICAndWkuc2VsZWN0JyxcbiAgICAgICAgJ25nU2FuaXRpemUnLFxuICAgICAgICAndG9hc3RyJyxcbiAgICAgICAgJ3ZBY2NvcmRpb24nLFxuICAgICAgICAnbmdBbmltYXRlJyxcbiAgICAgICAgJ2NoZWNrbGlzdC1tb2RlbCcsXG4gICAgICAgICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcbiAgICAgICAgJ3NuLnNrcm9sbHInLFxuICAgICAgICAnamtBbmd1bGFyQ2Fyb3VzZWwnLFxuICAgICAgICAnY2hlY2tsaXN0LW1vZGVsJyxcbiAgICAgICAgJ3J6TW9kdWxlJyxcbiAgICAgICAgJ25nTWF0ZXJpYWxEYXRlUGlja2VyJyxcbiAgICAgICAgIFxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0gQXBwIG1vZHVsZXMgLS0tLS0tLS0tLS0tLy9cblxuICAgICAgICAgXG5cbiAgICBdKVxuICAgIC5jb25maWcoW1wiJHVybFJvdXRlclByb3ZpZGVyXCIsIFwiJHN0YXRlUHJvdmlkZXJcIiwgXCJzblNrcm9sbHJQcm92aWRlclwiLCBcInRvYXN0ckNvbmZpZ1wiLCBcImNmcExvYWRpbmdCYXJQcm92aWRlclwiLCBjb25maWdGdW5jdGlvbl0pXG4gICAgLmNvbnN0YW50KFwiJGdsb2JhbFwiLCAkZ2xvYmFsKVxuICAgIC5jb25zdGFudChcIiRtZXNzYWdlXCIsICRtZXNzYWdlKVxuICAgIC5ydW4ocnVuKTtcblxuZnVuY3Rpb24gY29uZmlnRnVuY3Rpb24oJHVybFJvdXRlclByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgc25Ta3JvbGxyUHJvdmlkZXIsIHRvYXN0ckNvbmZpZywgY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XG4gICAgLy8gY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2U7XG5cblxuICAgIC8vTWFpbiBSb3V0aW5nXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdkZWZhdWx0Jywge1xuICAgICAgICAgICAgYWJzdHJhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgdXJsOlwiXCIsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgIGxheW91dDoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9zaGFyZWQvdmlld3MvZGVmYXVsdC1sYXlvdXQuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgc25Ta3JvbGxyUHJvdmlkZXIuY29uZmlnID0geyBzbW9vdGhTY3JvbGxpbmc6IHRydWUgfTtcblxuICAgIGFuZ3VsYXIuZXh0ZW5kKHRvYXN0ckNvbmZpZywge1xuICAgICAgICBhdXRvRGlzbWlzczogZmFsc2UsXG4gICAgICAgIGNvbnRhaW5lcklkOiAndG9hc3QtY29udGFpbmVyJyxcbiAgICAgICAgbWF4T3BlbmVkOiAwLFxuICAgICAgICBuZXdlc3RPblRvcDogdHJ1ZSxcbiAgICAgICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LXRvcC1mdWxsLXdpZHRoJyxcbiAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgICAgY2xvc2VCdXR0b246IHRydWVcbiAgICB9KTtcbn1cblxuIFxuXG5mdW5jdGlvbiBydW4oXG4gICAgJHJvb3RTY29wZSxcbiAgICAkaHR0cCxcbiAgICAkY29va2llcyxcbiAgICB0b2FzdHIsXG4gICAgc25Ta3JvbGxyLFxuICAgICRzdGF0ZVxuKSB7XG5cbiAgICAgY29uc29sZS5sb2coXCJhcHAgd29ya3NcIik7XG4gICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICBjb25zb2xlLmxvZyhcImZ1Y2xcIik7XG4gICAgIH0pO1xuICAgXG59XG4iLCJcbnJlcXVpcmUoJy4vbW9kdWxlcy92YWxpZGF0b3JzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZGlyZWN0aXZlcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2ZpbHRlcnMnKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBhbmd1bGFyLm1vZHVsZSgnY2xvdWRkZWNvci5jb21tb24nLCBbJ2Nsb3VkZGVjb3IudmFsaWRhdG9ycycsICdjbG91ZGRlY29yLmZpbHRlcnMnICwnY2xvdWRkZWNvci5kaXJlY3RpdmVzJ10pO1xufSkoKTsiLCIgXG4vLyAgbG9hZCBjb21tb24gbW9kdWxlc1xucmVxdWlyZSgnLi9jbG91ZGRlY29yLWNvbW1vbicpO1xuXG4vLyBFeHBvcnQgbmFtZXNwYWNlXG5tb2R1bGUuZXhwb3J0cyA9ICdjbG91ZGRlY29yLmNvbW1vbic7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2Nsb3VkRGVjb3IuZGlyZWN0aXZlLmFjY2Vzcy1sZXZlbCcsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2FjY2Vzc0xldmVsJywgYWNjZXNzTGV2ZWwpO1xuXG5mdW5jdGlvbiBhY2Nlc3NMZXZlbCh1c2VyU2VydmljZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgYWNjZXNzTGV2ZWw7XG4gICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnYWNjZXNzTGV2ZWwnLCBmdW5jdGlvbiAoYWNsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjbCkge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NMZXZlbCA9IGFjbDtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQ3NzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNzcygpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWNjZXNzTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VyU2VydmljZS5pc0F1dGhvcml6ZWQoYWNjZXNzTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGVsZW1lbnRbMF0ubm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIklOUFVUXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkJVVFRPTlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSIsIi8qKlxuKiBAZGVzYyB0aGlzIGRpcmVjdGl2ZSBpcyBmb3IgY2hlY2sgdGhlIGRpZmZlcmVuY2Ugb2YgdHdvIGVsZW1lbnRzIGFuZCBhcHBseSBhIGNzcyBjbGFzcyB0byBzaG93IHRoZSBkaWZmZXJlbmNlXG4qIEBleGFtcGxlIDxpbnB1dCBkaWZmPVwidXNlci5uYW1lXCI+PC9pbnB1dD5cbiovXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbG91ZERlY29yLmRpcmVjdGl2ZS5kaWZmJyxbXSlcbiAgICAuZGlyZWN0aXZlKCdkaWZmJywgZGlmZik7XG5cbmZ1bmN0aW9uIGRpZmYoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihzY29wZS52bS5lZGl0ZWRWaWV3KXtcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXkgPSBhdHRyaWJ1dGVzLmRpZmYuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBuZXdfdmFsID0gc2NvcGUudm0ubmV3VmVyc2lvbjtcbiAgICAgICAgICAgICAgICB2YXIgb2xkX3ZhbCA9IHNjb3BlLnZtLm9sZFZlcnNpb247XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFycmF5LCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdfdmFsID0gbmV3X3ZhbFtpXTtcbiAgICAgICAgICAgICAgICAgICAgb2xkX3ZhbCA9IG9sZF92YWxbaV07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYoIWFuZ3VsYXIuZXF1YWxzKG5ld192YWwsIG9sZF92YWwpKXtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZGlmZicpO1xuICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgfVxuICAgIH07XG59IiwicmVxdWlyZSgnLi9hY2Nlc3NfbGV2ZWwnKTtcbnJlcXVpcmUoJy4vZGlmZicpOyBcbnJlcXVpcmUoJy4vc3RpY2t5Jyk7XG5yZXF1aXJlKCcuL3RhYi1jaGFuZ2UnKTtcbiBcbihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2Nsb3VkZGVjb3IuZGlyZWN0aXZlcycsIFtcbiAgICAgICAgJ2Nsb3VkRGVjb3IuZGlyZWN0aXZlLmFjY2Vzcy1sZXZlbCcsXG4gICAgICAgICdjbG91ZERlY29yLmRpcmVjdGl2ZS5kaWZmJywgXG4gICAgICAgICdjbG91ZERlY29yLmRpcmVjdGl2ZS50YWItY2hhbmdlJyBcbiAgICBdKTtcbn0pKCk7XG5cbiIsIihmdW5jdGlvbiAobmFtZXNwYWNlKSB7XG4gICAgLy8gc2V0IHN0aWNreSBtb2R1bGUgYW5kIGRpcmVjdGl2ZVxuICAgIGFuZ3VsYXIubW9kdWxlKG5hbWVzcGFjZSwgW10pLmRpcmVjdGl2ZShuYW1lc3BhY2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgYW5ndWxhckVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGFuZ3VsYXJFbGVtZW50WzBdLFxuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGRvY3VtZW50XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50ID0gZWxlbWVudC5vd25lckRvY3VtZW50LFxuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHdpbmRvd1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cgPSBkb2N1bWVudC5kZWZhdWx0VmlldyxcblxuICAgICAgICAgICAgICAgIC8vIGdldCB3cmFwcGVyXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG5cbiAgICAgICAgICAgICAgICAvLyBjYWNoZSBzdHlsZVxuICAgICAgICAgICAgICAgICAgICBzdHlsZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzdHlsZScpLFxuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tID0gcGFyc2VGbG9hdChhdHRyc1tuYW1lc3BhY2UgKyAnQm90dG9tJ10pLFxuICAgICAgICAgICAgICAgICAgICBtZWRpYSA9IHdpbmRvdy5tYXRjaE1lZGlhKGF0dHJzW25hbWVzcGFjZSArICdNZWRpYSddIHx8ICdhbGwnKSxcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gcGFyc2VGbG9hdChhdHRyc1tuYW1lc3BhY2UgKyAnVG9wJ10pLFxuXG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSBzdGF0ZXNcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlQm90dG9tID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZVRvcCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSB7fTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbmZpZ3VyZSB3cmFwcGVyXG4gICAgICAgICAgICAgICAgd3JhcHBlci5jbGFzc05hbWUgPSAnaXMtJyArIG5hbWVzcGFjZTtcblxuICAgICAgICAgICAgICAgIC8vIGFjdGl2YXRlIHN0aWNreVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgZWxlbWVudCBjb21wdXRlZCBzdHlsZVxuICAgICAgICAgICAgICAgICAgICB2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBhY3RpdmVUb3AgPyAndG9wOicgKyB0b3AgOiAnYm90dG9tOicgKyBib3R0b20sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNpYmxpbmcgPSBlbGVtZW50Lm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgZWxlbWVudCB3aXRoIHdyYXBwZXIgY29udGFpbmluZyBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIG5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0eWxlIHdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6JyArIGNvbXB1dGVkU3R5bGUuZGlzcGxheSArICc7aGVpZ2h0OicgKyBlbGVtZW50Lm9mZnNldEhlaWdodCArICdweDttYXJnaW46JyArIGNvbXB1dGVkU3R5bGUubWFyZ2luICsgJzt3aWR0aDonICsgZWxlbWVudC5vZmZzZXRXaWR0aCArICdweCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0eWxlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2xlZnQ6JyArIG9mZnNldC5sZWZ0ICsgJ3B4O21hcmdpbjowO3Bvc2l0aW9uOmZpeGVkO3RyYW5zaXRpb246bm9uZTsnICsgcG9zaXRpb24gKyAncHg7d2lkdGg6JyArIGNvbXB1dGVkU3R5bGUud2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRlYWN0aXZhdGUgc3RpY2t5XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gd3JhcHBlci5wYXJlbnROb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNpYmxpbmcgPSB3cmFwcGVyLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlcGxhY2Ugd3JhcHBlciB3aXRoIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcblxuICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShlbGVtZW50LCBuZXh0U2libGluZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdW5zdHlsZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHlsZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBzdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyB1bnN0eWxlIHdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlVG9wID0gYWN0aXZlQm90dG9tID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gd2luZG93IHNjcm9sbCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9uc2Nyb2xsKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBhY3RpdmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVRvcCB8fCBhY3RpdmVCb3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCB3cmFwcGVyIG9mZnNldFxuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gd3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQm90dG9tID0gIWlzTmFOKGJvdHRvbSkgJiYgb2Zmc2V0LnRvcCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIGJvdHRvbSAtIHdyYXBwZXIub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVG9wID0gIWlzTmFOKHRvcCkgJiYgb2Zmc2V0LnRvcCA8IHRvcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVhY3RpdmF0ZSBpZiB3cmFwcGVyIGlzIGluc2lkZSByYW5nZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhY3RpdmVUb3AgJiYgIWFjdGl2ZUJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYWN0aXZhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBub3QgYWN0aXZhdGVkXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1lZGlhLm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBlbGVtZW50IG9mZnNldFxuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQm90dG9tID0gIWlzTmFOKGJvdHRvbSkgJiYgb2Zmc2V0LnRvcCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIGJvdHRvbSAtIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVG9wID0gIWlzTmFOKHRvcCkgJiYgb2Zmc2V0LnRvcCA8IHRvcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWN0aXZhdGUgaWYgZWxlbWVudCBpcyBvdXRzaWRlIHJhbmdlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVG9wIHx8IGFjdGl2ZUJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cgcmVzaXplIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb25yZXNpemUoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbmRpdGlvbmFsbHkgZGVhY3RpdmF0ZSBzdGlja3lcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVRvcCB8fCBhY3RpdmVCb3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWN0aXZhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlLWluaXRpYWxpemUgc3RpY2t5XG4gICAgICAgICAgICAgICAgICAgIG9uc2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZGVzdHJveSBsaXN0ZW5lclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9uZGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICAgICAgb25yZXNpemUoKTtcblxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25zY3JvbGwpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25yZXNpemUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGJpbmQgbGlzdGVuZXJzXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIG9uc2Nyb2xsKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25yZXNpemUpO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIG9uZGVzdHJveSk7XG5cbiAgICAgICAgICAgICAgICAvLyBpbml0aWFsaXplIHN0aWNreVxuICAgICAgICAgICAgICAgIG9uc2Nyb2xsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG59KSgnc3RpY2t5Jyk7IiwiXG4vKipcbiogQGRlc2MgdGFiIGNoYW5nZSBkaXJlY3RpdmUgaXMgdG8gY2hhbmdlIHRhYiBpbmRleCB1cG9uIGEgc2VwZXJhdGUgZXZlbnQoYnV0dG9uKSBjbGlja1xuKiBAZXhhbXBsZSA8YnV0dG9uIHRhYi1jaGFuZ2UgdGFicz1cIltudW1iZXIgb2YgdGFic11cIj48L2J1dHRvbj5cbiovXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbG91ZERlY29yLmRpcmVjdGl2ZS50YWItY2hhbmdlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgndGFiQ2hhbmdlJywgdGFiQ2hhbmdlKTtcblxuZnVuY3Rpb24gdGFiQ2hhbmdlKCRsb2NhdGlvbiwgJGFuY2hvclNjcm9sbCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgICAgIHZhciBhbGlhcyA9IGF0dHJpYnV0ZXMuYWxpYXMgfHwgXCJ2bVwiO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0VGFiSW5kZXggPSBhdHRyaWJ1dGVzLnRhYnMgPyBhdHRyaWJ1dGVzLnRhYnMgLSAxIDogbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFRhYkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlW2FsaWFzXS5zZWxlY3RlZEluZGV4ID0gKHNjb3BlW2FsaWFzXS5zZWxlY3RlZEluZGV4ID09PSBsYXN0VGFiSW5kZXgpID8gMCA6IHNjb3BlW2FsaWFzXS5zZWxlY3RlZEluZGV4ICsgMTtcbiAgICAgICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICAgICAgaWYgKCRsb2NhdGlvbi5oYXNoKCkgIT09IFwiZm9ybS10YWJcIikge1xuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24uaGFzaChcImZvcm0tdGFiXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBpbml0KTtcbiAgICAgICAgfVxuICAgIH07XG59IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2Nsb3VkRGVjb3IuZmlsdGVycy5jYXBpdGFsaXplJywgW10pXG4gICAgLmZpbHRlcignY2FwaXRhbGl6ZScsIGNhcGl0YWxpemUpO1xuXG5mdW5jdGlvbiBjYXBpdGFsaXplKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gKCEhaW5wdXQpID8gaW5wdXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKSA6ICcnO1xuICAgIH07XG59XG4iLCJyZXF1aXJlKCcuL2NhcGl0YWxpemUnKTtcbnJlcXVpcmUoJy4vbGFuZ3VhZ2VTcGxpdCcpO1xuXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2Nsb3VkZGVjb3IuZmlsdGVycycsIFtcbiAgICAgICAgJ2Nsb3VkRGVjb3IuZmlsdGVycy5jYXBpdGFsaXplJyxcbiAgICAgICAgJ2Nsb3VkRGVjb3IuZmlsdGVycy5sYW5ndWFnZV9zcGxpdCdcbiAgICBdKTtcbn0pKCk7IiwiLyoqXG4gKiBUaGlzIGZpbHRlciByZW1vdmUgY291bnRyeSBjb2RlIGZyb20gbGFuZ3VhZ2UgY29kZVxuICovXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnY2xvdWREZWNvci5maWx0ZXJzLmxhbmd1YWdlX3NwbGl0JywgW10pXG4gICAgLmZpbHRlcignbGFuZ3VhZ2VTcGxpdCcsIGxhbmd1YWdlU3BsaXQpO1xuXG5mdW5jdGlvbiBsYW5ndWFnZVNwbGl0KCkge1xuICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBhbmd1bGFyLmlzRGVmaW5lZChpbnB1dCkgJiZcbiAgICAgICAgICAgIGlucHV0ICE9PSBudWxsICYmXG4gICAgICAgICAgICBpbnB1dCAhPT0gJycgJiZcbiAgICAgICAgICAgIGlucHV0LnNlYXJjaCgnLScpICE9PSAtMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5zcGxpdCgnLScpWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsIi8qKlxuKiBAZGVzYyBhbHBoYSBudW1lcmljIFZhbCBkaXJlY3RpdmUgaXMgdG8gdmFsaWRhdGUgYWxwaGFuZXVtZXJpYyB2YWx1ZXMgcHJvdmlkZWQgd2l0aCB0aGUgVUlcbiogQGV4YW1wbGUgPGlucHV0IGFscGhhLW51bWVyaWMtdmFsPVwiRE9ULCBTSU5HTEUtUVVPVEUsIFNMQVNIXCI+PC9pbnB1dD5cbiovXG5cbmFuZ3VsYXIubW9kdWxlKCdjbG91ZERlY29yLnZhbGlkYXRvcnMuYWxwaGFOdW1lcmljJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnYWxwaGFOdW1lcmljVmFsJywgYWxwaGFOdW1lcmljVmFsKTtcblxuZnVuY3Rpb24gYWxwaGFOdW1lcmljVmFsKCRnbG9iYWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBSRUdFWF9TVFJJTkcgPSAnJztcbiAgICAgICAgICAgIHZhciB2YWxpZF9jaGFyYWN0ZXJzID0gYXR0cnMuYWxwaGFOdW1lcmljVmFsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJGdsb2JhbC5DSEFSQUNURVJTLCBmdW5jdGlvbiAoY2hhcmFjdGVyLCBsYWJlbCkge1xuICAgICAgICAgICAgICAgIGlmICggdmFsaWRfY2hhcmFjdGVycy5pbmRleE9mKGxhYmVsKSA+IC0xICl7XG4gICAgICAgICAgICAgICAgICAgIFJFR0VYX1NUUklORyA9IFJFR0VYX1NUUklORyArIGNoYXJhY3RlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgUkVHRVhfU1RSSU5HID0gbmV3IFJlZ0V4cCgnW15hLXpBLVowLTknICsgUkVHRVhfU1RSSU5HICsgJ10nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMucHVzaChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZCh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjbGVhbiA9IHZhbC5yZXBsYWNlKFJFR0VYX1NUUklORywgJycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNsZWFuICE9PSB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShjbGVhbik7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW47XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgnY2xvdWREZWNvci52YWxpZGF0b3JzLmVtYWlsJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZW1haWxWYWwnLCBlbWFpbFZhbCk7XG5cbmZ1bmN0aW9uIGVtYWlsVmFsKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgICAvLyBvbmx5IGFwcGx5IHRoZSB2YWxpZGF0b3IgaWYgbmdNb2RlbCBpcyBwcmVzZW50IGFuZCBBbmd1bGFyIGhhcyBhZGRlZCB0aGUgZW1haWwgdmFsaWRhdG9yXG4gICAgICAgICAgICBpZiAoY3RybCAmJiBjdHJsLiR2YWxpZGF0b3JzLmVtYWlsKSB7XG4gICAgICAgICAgICAgICAgdmFyIEVNQUlMX1JFR0VYUCA9IC9eW19hLXpBLVowLTldKyhcXC5bX2EtekEtWjAtOV0rKSpAW2EtekEtWjAtOS1dKyhcXC5bYS16QS1aMC05LV0rKSooXFwuW2Etel17Miw0fSkkLztcblxuICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCBvdmVyd3JpdGUgdGhlIGRlZmF1bHQgQW5ndWxhciBlbWFpbCB2YWxpZGF0b3JcbiAgICAgICAgICAgICAgICBjdHJsLiR2YWxpZGF0b3JzLmVtYWlsID0gZnVuY3Rpb24obW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3RybC4kaXNFbXB0eShtb2RlbFZhbHVlKSB8fCBFTUFJTF9SRUdFWFAudGVzdChtb2RlbFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuICIsInJlcXVpcmUoJy4vYWxwaGFOdW1lcmljJyk7XG5yZXF1aXJlKCcuL2VtYWlsJyk7XG5yZXF1aXJlKCcuL2ludGVnZXInKTtcbnJlcXVpcmUoJy4vbWF0Y2gnKTtcbnJlcXVpcmUoJy4vbnVtYmVyJyk7XG5yZXF1aXJlKCcuL3Jlc2V0UGFyc2UnKTtcbnJlcXVpcmUoJy4vdW5pcXVlJyk7XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgYW5ndWxhci5tb2R1bGUoJ2Nsb3VkZGVjb3IudmFsaWRhdG9ycycsIFtcbiAgICAgICAgJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5hbHBoYU51bWVyaWMnLFxuICAgICAgICAnY2xvdWREZWNvci52YWxpZGF0b3JzLmVtYWlsJyxcbiAgICAgICAgJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5pbnRlZ2VyJyxcbiAgICAgICAgJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5tYXRjaCcsXG4gICAgICAgICdjbG91ZERlY29yLnZhbGlkYXRvcnMubnVtYmVyJyxcbiAgICAgICAgJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy5yZXNldFBhcnNlJyxcbiAgICAgICAgJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy51bmlxdWUnXG4gICAgXSk7XG59KSgpO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnY2xvdWREZWNvci52YWxpZGF0b3JzLmludGVnZXInLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdpbnRlZ2VyVmFsJywgaW50ZWdlclZhbCk7XG5cbmZ1bmN0aW9uIGludGVnZXJWYWwoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgaWYgKCFuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMucHVzaChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZCh2YWwpIHx8IHZhbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YWwgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2xlYW4gPSB2YWwudG9TdHJpbmcoKS5yZXBsYWNlKC9bXjAtOV0vZywgJycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNsZWFuICE9PSB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShjbGVhbik7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYW47XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cblxuIiwiLyoqXG4qIEBkZXNjIHRoaXMgZGlyZWN0aXZlIGlzIGZvciBtYXRjaGluZyB0d28gdmFsdWVzXG4qIEBleGFtcGxlIDxpbnB1dCBtYXRjaD1cIltuZy1tb2RlbCB0byB3aGljaCBuZWVkcyB0byBiZSBjb21wYXJlZCB0b11cIj48L2lucHV0PlxuKi9cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdjbG91ZERlY29yLnZhbGlkYXRvcnMubWF0Y2gnLFtdKVxuICAgIC5kaXJlY3RpdmUoJ21hdGNoJywgbWF0Y2gpO1xuXG5mdW5jdGlvbiBtYXRjaCgkcGFyc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgICAgICBcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7ICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLm1hdGNoKShzY29wZSkgPT09IGN0cmwuJG1vZGVsVmFsdWU7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbih2YWxpZGl0eSkge1xuICAgICAgICAgICAgICAgIGN0cmwuJHNldFZhbGlkaXR5KCdtYXRjaCcsIHZhbGlkaXR5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdjbG91ZERlY29yLnZhbGlkYXRvcnMubnVtYmVyJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnbnVtYmVyVmFsJywgbnVtYmVyVmFsKTtcblxuZnVuY3Rpb24gbnVtYmVyVmFsKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgIGlmICghbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsKSB8fCB2YWwgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNsZWFuID0gdmFsLnRvU3RyaW5nKCkucmVwbGFjZSgvW14wLTlcXC5dL2csICcnKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVjaW1hbENoZWNrID0gY2xlYW4uc3BsaXQoJy4nKTtcblxuICAgICAgICAgICAgICAgIGlmICghYW5ndWxhci5pc1VuZGVmaW5lZChkZWNpbWFsQ2hlY2tbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlY2ltYWxDaGVja1sxXSA9IGRlY2ltYWxDaGVja1sxXS5zbGljZSgwLDIpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhbiA9IGRlY2ltYWxDaGVja1swXSArICcuJyArIGRlY2ltYWxDaGVja1sxXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSBjbGVhbikge1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGNsZWFuKTtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjbGVhbjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlbGVtZW50LmJpbmQoJ2tleXByZXNzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnY2xvdWREZWNvci52YWxpZGF0b3JzLnJlc2V0UGFyc2UnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdyZXNldFBhcnNlJywgcmVzZXRQYXJzZSk7XG5cbmZ1bmN0aW9uIHJlc2V0UGFyc2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICBcbiAgICAgICAgICAgIGlmICghbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgIHZhciBmb3JtX25hbWUgPSBhdHRyaWJ1dGVzLmZvcm1fbmFtZSB8fCBcInBkX2Zvcm1cIjtcbiAgICAgICAgICAgIHZhciBhbGlhcyA9IGF0dHJpYnV0ZXMuYWxpYXMgfHwgXCJqb3VybmFsaXN0XCI7XG5cblxuXG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbDtcblxuICAgICAgICAgICAgICAgIGlmIChzY29wZVthbGlhc11bZm9ybV9uYW1lXS4kc3VibWl0dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IGF0dHJpYnV0ZXMubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzX3VzZXJfZXJyb3IgPSBhdHRyaWJ1dGVzLnJlc2V0UGFyc2U7XG5cblxuICAgICAgICAgICAgICAgICAgICBzY29wZVthbGlhc11bZm9ybV9uYW1lXVtmaWVsZF0uJHNldFZhbGlkaXR5KCdwYXJzZScsIHRydWUsIG5nTW9kZWxDdHJsKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGVbYWxpYXNdLmVycm9ycyAmJiBpc191c2VyX2Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZVthbGlhc10uZXJyb3JzW2lzX3VzZXJfZXJyb3JdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCIvKipcbiogQGRlc2MgdGhpcyBkaXJlY3RpdmUgaXMgZm9yIGNoZWNrIHRoZSB1bmlxdWVuZXNzIGFnYWluc3QgZ2l2ZW4gYXJyYXkgb2YgbmctbW9kZWwgdmFsdWVzXG4qIEBleGFtcGxlIDxpbnB1dCB1bmlxdWUtZW1haWw9XCJuZy1tb2RlbDEsIG5nLW1vZGVsMi4uLi5cIj48L2lucHV0PlxuKi9cblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2Nsb3VkRGVjb3IudmFsaWRhdG9ycy51bmlxdWUnLFtdKVxuICAgIC5kaXJlY3RpdmUoJ3VuaXF1ZScsIHVuaXF1ZSk7XG5cbmZ1bmN0aW9uIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcywgbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgIGlmICghbmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZTtcblxuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMucHVzaChmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbDtcblxuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLnVuaXF1ZSAmJiBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0VmFsaWRpdHkoJ2lzVW5pcXVlRW1haWwnLCBpc1ZhbGlkKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkKCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGFycmF5ID0gYXR0cmlidXRlcy51bmlxdWUucmVwbGFjZSgvW1xcc10rL2csICcnKS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhcnJheSwgZnVuY3Rpb24oZW1haWxGaWVsZCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbWFpbFZhbHVlID0gJChcImlucHV0W25hbWU9XCIrIGVtYWlsRmllbGQgK1wiXVwiKS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbGlkaXR5ID0gZ2V0VmFsaWRpdHkoZW1haWxWYWx1ZSwgZW1haWxGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEZpZWxkKGVtYWlsRmllbGQsIHZhbGlkaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWxpZCAmJiB2YWxpZGl0eTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChhcnJheSwgZnVuY3Rpb24oZmllbGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsRmllbGQgIT09IGZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSAoKCQoXCJpbnB1dFtuYW1lPVwiKyBmaWVsZCArXCJdXCIpLnZhbCgpICkgIT09IGVtYWlsVmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEZpZWxkKGVtYWlsRmllbGQsIGlzVmFsaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRGaWVsZChmaWVsZCwgaXNWYWxpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWxpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VmFsaWRpdHkoZW1haWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAodmFsdWUgIT09IGVtYWlsVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRGaWVsZChlbWFpbEZpZWxkLCB2YWxpZGl0eSkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnZtLmNkX2Zvcm1bZW1haWxGaWVsZF0uJHNldFZhbGlkaXR5KCdpc1VuaXF1ZUVtYWlsJywgdmFsaWRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xufSIsInZhciAkZ2xvYmFsID0ge307XG5cbiRnbG9iYWwuU0VDVElPTiA9ICdwcmVzc2RlY29yJztcbiRnbG9iYWwuSVRFTVNfUEVSX1BBR0UgPSAnMjAnO1xuXG4vKipcbiAqIEhUVFAgcmVzcG9uc2UgY29kZXNcbiAqL1xuJGdsb2JhbC5IVFRQMjAwID0gMjAwO1xuJGdsb2JhbC5IVFRQMjAxID0gMjAxO1xuJGdsb2JhbC5IVFRQMjA0ID0gMjA0O1xuJGdsb2JhbC5IVFRQNDAwID0gNDAwO1xuJGdsb2JhbC5IVFRQNDAxID0gNDAxO1xuJGdsb2JhbC5IVFRQNDAzID0gNDAzO1xuJGdsb2JhbC5IVFRQNDA0ID0gNDA0O1xuJGdsb2JhbC5IVFRQNDIyID0gNDIyO1xuJGdsb2JhbC5IVFRQNTAwID0gNTAwO1xuXG4vKipcbiAqIEFsZXJ0IHR5cGVzXG4gKi9cbiRnbG9iYWwuSU5GTyA9ICdpbmZvJztcbiRnbG9iYWwuRVJST1IgPSAnZXJyb3InO1xuJGdsb2JhbC5TVUNDRVNTID0gJ3N1Y2Nlc3MnO1xuJGdsb2JhbC5XQVJOSU5HID0gJ3dhcm5pbmcnO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBVc2VyICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuLyoqXG4gKiBBY3Rpb24gdHlwZXNcbiAqL1xuJGdsb2JhbC5BQ1RJT05TID0ge1xuICAgIEFERDogJ2FkZCcsXG4gICAgRURJVDogJ2VkaXQnXG59O1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBTdWJzY3JpcHRpb24gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogc29sdXRpb24gdHlwZXNcbiAqL1xuJGdsb2JhbC5TT0xVVElPTlMgPSB7XG4gICAgQ0xPVURERUNPUjogJ2Nsb3VkZGVjb3InLFxuICAgIE1BUktFVFBMQUNFOiAnbWFya2V0cGxhY2UnXG59O1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQcm9kdWN0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4kZ2xvYmFsLkNPTE9SX1ZBUklBTlQgPSAnY29sb3InO1xuXG4kZ2xvYmFsLkNPTE9SUyA9IFtcbiAgICB7ICdjb2RlJzogJ2VkODQ3NycsICdjbGFzcyc6ICdiZy0xJyB9LFxuICAgIHsgJ2NvZGUnOiAnZDI0MDM2JywgJ2NsYXNzJzogJ2JnLTInIH0sXG4gICAgeyAnY29kZSc6ICdhNTI2MTgnLCAnY2xhc3MnOiAnYmctMycgfSxcbiAgICB7ICdjb2RlJzogJ2MyNGIyMScsICdjbGFzcyc6ICdiZy00JyB9LFxuICAgIHsgJ2NvZGUnOiAnNzAyMDFjJywgJ2NsYXNzJzogJ2JnLTUnIH0sXG4gICAgeyAnY29kZSc6ICdmYmYyOTgnLCAnY2xhc3MnOiAnYmctNicgfSxcbiAgICB7ICdjb2RlJzogJ2ZhZGU0YicsICdjbGFzcyc6ICdiZy03JyB9LFxuICAgIHsgJ2NvZGUnOiAnZjViYjQxJywgJ2NsYXNzJzogJ2JnLTgnIH0sXG4gICAgeyAnY29kZSc6ICdmMmE1M2EnLCAnY2xhc3MnOiAnYmctOScgfSxcbiAgICB7ICdjb2RlJzogJ2VlNzkyZicsICdjbGFzcyc6ICdiZy0xMCcgfSxcbiAgICB7ICdjb2RlJzogJ2MzNGMyMScsICdjbGFzcyc6ICdiZy0xMScgfSxcbiAgICB7ICdjb2RlJzogJ2Y3Y2RmMycsICdjbGFzcyc6ICdiZy0xMicgfSxcbiAgICB7ICdjb2RlJzogJ2E5NGM4YScsICdjbGFzcyc6ICdiZy0xMycgfSxcbiAgICB7ICdjb2RlJzogJzZkMjg1NScsICdjbGFzcyc6ICdiZy0xNCcgfSxcbiAgICB7ICdjb2RlJzogJzNkMTYyMycsICdjbGFzcyc6ICdiZy0xNScgfSxcbiAgICB7ICdjb2RlJzogJzUwMmUxNScsICdjbGFzcyc6ICdiZy0xNicgfSxcbiAgICB7ICdjb2RlJzogJzYwNTM0NycsICdjbGFzcyc6ICdiZy0xNycgfSxcbiAgICB7ICdjb2RlJzogJ2QxZjNiNicsICdjbGFzcyc6ICdiZy0xOCcgfSxcbiAgICB7ICdjb2RlJzogJ2NkZjM4MScsICdjbGFzcyc6ICdiZy0xOScgfSxcbiAgICB7ICdjb2RlJzogJzc4YzU2MicsICdjbGFzcyc6ICdiZy0yMCcgfSxcbiAgICB7ICdjb2RlJzogJzYyOTA1NScsICdjbGFzcyc6ICdiZy0yMScgfSxcbiAgICB7ICdjb2RlJzogJzJlNTAyNScsICdjbGFzcyc6ICdiZy0yMicgfSxcbiAgICB7ICdjb2RlJzogJzJlNjc2NycsICdjbGFzcyc6ICdiZy0yMycgfSxcbiAgICB7ICdjb2RlJzogJ2UxZmJmZScsICdjbGFzcyc6ICdiZy0yNCcgfSxcbiAgICB7ICdjb2RlJzogJ2QwZThmMicsICdjbGFzcyc6ICdiZy0yNScgfSxcbiAgICB7ICdjb2RlJzogJzVhYTJiMCcsICdjbGFzcyc6ICdiZy0yNicgfSxcbiAgICB7ICdjb2RlJzogJzNkOGFiMicsICdjbGFzcyc6ICdiZy0yNycgfSxcbiAgICB7ICdjb2RlJzogJzI5M2E0ZScsICdjbGFzcyc6ICdiZy0yOCcgfSxcbiAgICB7ICdjb2RlJzogJzFlMmQzZCcsICdjbGFzcyc6ICdiZy0yOScgfSxcbiAgICB7ICdjb2RlJzogJzEzMWIyNicsICdjbGFzcyc6ICdiZy0zMCcgfSxcbiAgICB7ICdjb2RlJzogJzEyMTMxYScsICdjbGFzcyc6ICdiZy0zMScgfSxcbiAgICB7ICdjb2RlJzogJ2FjYWNhYycsICdjbGFzcyc6ICdiZy0zMicgfVxuXTtcblxuJGdsb2JhbC5QUk9EVUNUX1NBVkUgPSAnc2F2ZSc7XG4kZ2xvYmFsLlBST0RVQ1RfU0FWRV9EUkFGVCA9ICdzYXZlX2RyYWZ0JztcbiRnbG9iYWwuUFJPRFVDVF9FRElUID0gJ2VkaXQnO1xuJGdsb2JhbC5QUk9EVUNUX0VESVRfRFJBRlQgPSAnZWRpdF9kcmFmdCc7XG5cbiRnbG9iYWwuUFJPRFVDVF9JTUFHRSA9ICdpbWFnZSc7XG4kZ2xvYmFsLlBST0RVQ1RfTk9UX0ZPVU5EID0gJ1BSRDAwNic7XG5cbi8qKioqKioqKiBTcGVjaWFsIGNoYXJhY3RlcnMgdG8gc2V0IGFzIGFscGhhIG51bWVyaWMgdmFsdWVzICoqKioqKioqKioqKiovXG4kZ2xvYmFsLkNIQVJBQ1RFUlMgPSB7XG4gICAgJ1VOREVSU0NPUkUnOiAnXycsXG4gICAgJ0NPTU1BJzogJywnLFxuICAgICdTUEFDRSc6ICcgJyxcbiAgICAnRE9UJzogJy4nLFxuICAgICdTTEFTSCc6ICcvJyxcbiAgICAnQU1QRVJTQU5EJzogJyYnLFxuICAgICdTSU5HTEUtUVVPVEUnOiAnXFwnJyxcbiAgICAnUVVPVEUnOiAnXCInLFxuICAgICdBU1RFUklTSyc6ICcqJyxcbiAgICAnQVQnOiAnQCcsXG4gICAgJ1BMVVMnOiAnKycsXG4gICAgJ0hBU0gnOiAnIycsXG4gICAgJ1FVRVNUSU9OLU1BUksnOiAnPycsXG4gICAgJ0hZUEhFTic6ICctJ1xufTtcbm1vZHVsZS5leHBvcnRzID0gJGdsb2JhbDsiLCJ2YXIgJG1lc3NhZ2UgPSB7fTtcblxuXG4vKipcbiAqIFN1Y2Nlc3MgbWVzc2FnZXNcbiAqL1xuJG1lc3NhZ2UuUE9TVF9BRERFRF9TVUNDRVNTID0gJ1Bvc3QgYWRkZWQgc3VjY2Vzc2Z1bGx5JztcbiRtZXNzYWdlLlBPU1RfVVBEQVRFRF9TVUNDRVNTID0gJ1Bvc3QgdXBkYXRlZCBzdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuUE9TVF9ERUxFVEVEX1NVQ0NFU1MgPSAnUG9zdCBkZWxldGVkIHN1Y2Nlc3NmdWxseSc7XG5cbiRtZXNzYWdlLlBST0RVQ1RfQURERURfU1VDQ0VTUyA9ICdQcm9kdWN0IGhhcyBiZWVuIGFkZGVkJztcbiRtZXNzYWdlLlBST0RVQ1RfRFJBRlRfQURERURfU1VDQ0VTUyA9ICdQcm9kdWN0IGhhcyBiZWVuIGFkZGVkIGFzIGRyYWZ0JztcbiRtZXNzYWdlLlBST0RVQ1RfVVBEQVRFRF9TVUNDRVNTID0gJ1Byb2R1Y3QgaGFzIGJlZW4gdXBkYXRlZCc7XG4kbWVzc2FnZS5QUk9EVUNUX0RSQUZUX1VQREFURURfU1VDQ0VTUyA9ICdQcm9kdWN0IGhhcyBiZWVuIHVwZGF0ZWQgYXMgZHJhZnQnO1xuJG1lc3NhZ2UuUFJPRFVDVF9OT1RfVVBEQVRFRCA9ICdOb3RoaW5nIGZvciB1cGRhdGUnO1xuJG1lc3NhZ2UuUFJPRFVDVF9OT1RfRk9VTkRfRVJSID0gJ05vIFByb2R1Y3RzIGZvdW5kJztcbiRtZXNzYWdlLlBST0RVQ1RfRE9XTkxPQURfTUFJTF9TVUNDRVNTID0gXCJNYWlsIFNlbnQgU3VjY2Vzc2Z1bGx5XCI7XG4kbWVzc2FnZS5QUk9EVUNUX0RPV05MT0FEX0VSUk9SID0gXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2FpblwiO1xuJG1lc3NhZ2UuUFJPRFVDVF9ET1dOTE9BRF9JTUFHRV9FTVBUWSA9IFwiQXRsZWFzdCBvbmUgaW1hZ2Ugc2hvdWxkIGJlIHNlbGVjdGVkIHRvIGRvd25sb2FkXCI7XG4vL3JldGFpbGVyXG4kbWVzc2FnZS5SRVRBSUxFUl9BRERFRF9TVUNDRVNTID0gJ1JldGFpbGVyIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5JztcblxuLy9hY2NvdW50IFxuJG1lc3NhZ2UuUkVUQUlMRVJfVVNFUl9BRERFRF9TVUNDRVNTID0gJ1JldGFpbGVyIHVzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5JztcbiRtZXNzYWdlLlJFVEFJTEVSX1VTRVJfRURJVEVEX1NVQ0NFU1MgPSAnUmV0YWlsZXIgdXNlciB1cGRhdGVkIHN1Y2Nlc3NmdWxseSc7XG4kbWVzc2FnZS5SRVRBSUxFUl9FRElURURfU1VDQ0VTUyA9ICdSZXRhaWxlciB1cGRhdGVkIHN1Y2Nlc3NmdWxseSc7XG4kbWVzc2FnZS5BQ0NPVU5UX0lNQUdFX1VQTE9BRF9TVUNDRVNTID0gXCJSZXRhaWxlciBzdG9yZSBpbWFnZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHlcIjtcblxuLy9qb3VybmFsaXN0XG4kbWVzc2FnZS5KT1VSTkFMSVNUX1VTRVJfQURERURfU1VDQ0VTUyA9ICdKb3VybmFsaXN0IHVzZXIgYWRkZWQgc3VjY2Vzc2Z1bGx5JztcblxuLy9jc29cbiRtZXNzYWdlLlBST0RVQ1RfQUNDRVBUX1NVQ0NFU1MgPSAnUHJvZHVjdCBBY2NlcHRlZCBTdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuUFJPRFVDVF9SRUpFQ1RfU1VDQ0VTUyA9ICdQcm9kdWN0IFJlamVjdGVkIFN1Y2Nlc3NmdWxseSc7XG4kbWVzc2FnZS5SRVRBSUxFUl9BQ0NFUFRfU1VDQ0VTUyA9ICdSZXRhaWxlciBBY2NlcHRlZCBTdWNjZXNzZnVsbHknO1xuJG1lc3NhZ2UuUkVUQUlMRVJfUkVKRUNUX1NVQ0NFU1MgPSAnUmV0YWlsZXIgUmVqZWN0ZWQgU3VjY2Vzc2Z1bGx5JztcblxuLy9icmFuZFxuJG1lc3NhZ2UuQlJBTkRfQUREX1NVQ0NFU1MgPSAnQnJhbmQgYWRkZWQgc3VjY2Vzc2Z1bGx5Lic7XG4kbWVzc2FnZS5CUkFORF9QUk9GSUxFX0ZFVENIX0VSUk9SID0gXCJCcmFuZCBub3QgZm91bmRcIjtcblxuXG4vKipcbiAqIEluZm9ybWF0aW9uIG1lc3NhZ2VzXG4gKi9cbiRtZXNzYWdlLlBPU1RfTElTVF9FTVBUWV9JTkZPID0gJ1Bvc3RzIG5vdCBmb3VuZCc7XG4kbWVzc2FnZS5GT1JNX0lOVkFMSUQgPSAnUGxlYXNlIGVudGVyIG1hbmRhdG9yeSBmaWVsZHMgdG8gcHJvY2VlZCc7XG5cbi8vYWNjb3VudFxuJG1lc3NhZ2UuUkVUQUlMRVJfVVNFUl9GRVRDSF9FUlJPUiA9ICdSZXRhaWxlciB1c2VycyBub3QgZm91bmQuJztcbiRtZXNzYWdlLlJFVEFJTEVSX1BST0ZJTEVfRkVUQ0hfRVJST1IgPSAnUmV0YWlsZXIgcHJvZmlsZSBub3QgZm91bmQuJztcblxuXG5cbi8qKlxuICogRXJyb3IgbWVzc2FnZXNcbiAqL1xuLy9QUk9EVUNUX0RFVEFJTF9MRUFEX0ZBSUxcbiRtZXNzYWdlLkhUVFA1MDBfRVJST1IgPSAnU29tZSBlcnJvciBoYXMgb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4nO1xuJG1lc3NhZ2UuTUFSS0VUX1BMQUNFX0xJU1RfRVJST1IgPSAnTWFya2V0IHBsYWNlcyBub3QgZm91bmQnO1xuJG1lc3NhZ2UuTUFSS0VUX1BMQUNFX0FUVFJJQlVURVNfRVJST1IgPSAnTWFya2V0IHBsYWNlcyBhdHRyaWJ1dGVzIG5vdCBmb3VuZCc7XG4kbWVzc2FnZS5DQVRFR09SWV9GRVRDSF9FUlJPUiA9ICdDYW4gbm90IGZldGNoIHRoZSBjYXRlZ29yeSc7XG5cbiRtZXNzYWdlLkNPVU5UUllfRkVUQ0hfRVJST1IgPSAnQ291bnRyaWVzIG5vdCBmb3VuZC4nO1xuJG1lc3NhZ2UuQ0lUWV9GRVRDSF9FUlJPUiA9ICdDaXRpZXMgbm90IGZvdW5kLic7XG4kbWVzc2FnZS5ST0xFU19GRVRDSF9FUlJPUiA9ICdVc2VyIHJvbGVzIG5vdCBmb3VuZC4nO1xuXG4kbWVzc2FnZS5QUk9EVUNUX05PVF9GT1VORCA9ICdBbGwgdGhlIHByb2R1Y3RzIGhhcyBsb2FkZWQnO1xuJG1lc3NhZ2UuUFJPRFVDVDQwNF9FUlJPUiA9ICdTb3JyeSwgdGhlIHJlcXVlc3RlZCBwcm9kdWN0IGlzIG5vdCBhdmFpbGFibGUnO1xuXG4vL1Byb2R1Y3QgRWRpdFxuJG1lc3NhZ2UuUFJPRFVDVF9ERVRBSUxfTEVBRF9GQUlMID0gJ1NvbWUgZXJyb3IgaGFzIG9jY3VycmVkLiBQbGVhc2UgdHJ5IGFnYWluJztcblxuLy9hY2NvdW50XG4kbWVzc2FnZS5BQ0NPVU5UX0lNQUdFX1VQTE9BRF9FUlJPUiA9IFwiUmV0YWlsZXIgc3RvcmUgaW1hZ2UgdXBsb2FkIGVycm9yXCI7XG4kbWVzc2FnZS5DVVJSRU5DWV9MSVNUX0ZFVENIX0VSUk9SID0gXCJDYW5ub3QgZmV0Y2ggY3VycmVuY3kgbGlzdC5cIjtcbiRtZXNzYWdlLkNVUlJFTkNZX0ZFVENIX0VSUk9SID0gXCJDYW5ub3QgZmV0Y2ggY3VycmVuY3kgY29kZS5cIjtcblxuLy9zdWJzY3JpcHRpb25cbiRtZXNzYWdlLlNVQlNDUklQVElPTl9QTEFOX0ZFVENIX0VSUk9SID0gJ1N1YnNjcmlwdGlvbiBwbGFuIG5vdCBmb3VuZC4nO1xuXG4vL2Nzb1xuJG1lc3NhZ2UuUFJPRFVDVF9GRVRDSF9FUlJPUiA9IFwiUHJvZHVjdCBub3QgZm91bmQuXCI7XG5cbi8vcmV0YWlsZXJcbiRtZXNzYWdlLlJFVEFJTEVSX0xJU1RfTk9UX0ZPVU5EID0gXCJSZXRhaWxlciBSZXF1ZXN0cyBsb2FkaW5nIGVycm9yLlwiO1xuXG4vL2JyYW5kXG4kbWVzc2FnZS5VU0VSX1JPTEVfTk9UX0ZPVU5EID0gJ1VzZXIgUm9sZSBub3QgZm91bmQuJztcbiRtZXNzYWdlLkZPUk1fSU5WQUxJRCA9ICdQbGVhc2UgZmlsbCBtYW5kb3RvcnkgZmllbGRzIHRvIHByb2NlZWQnO1xuXG5cbi8vQUNMXG4kbWVzc2FnZS5VTkFUSE9SSVpFRCA9IFwiWW91IGRvbid0IGhhdmUgIHJlcXVpcmVkIHBlcm1pc3Npb25zLlwiO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gJG1lc3NhZ2U7Il19
