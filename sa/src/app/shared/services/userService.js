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