require('./controllers');
require('./directives');
require('./services');
require('./validators');

(function () {
    "use strict";
    angular.module('sa-hack.shared', ['sa-hack.validators', 'sa-hack.directives', 'sa-hack.services', 'sa-hack.controllers']);
})();

module.exports = 'sa-hack.shared';