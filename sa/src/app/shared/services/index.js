
require('./commonService');
require('./userService');

angular.module('sa-hack.services', ['sa-hack.controllers.CommonService','sa-hack.controllers.UserService']);

module.exports = 'sa-hack.services';