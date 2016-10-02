
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
