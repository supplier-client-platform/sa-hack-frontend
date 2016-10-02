
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

