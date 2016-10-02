
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
