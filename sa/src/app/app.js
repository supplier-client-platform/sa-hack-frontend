
require('./shared/common');

/**
 * ENV
 */
var $global = require('./shared/utils/constants.js');
var $message = require('./shared/utils/messages.js');

angular
    .module('sa-hack', [

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
