
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


