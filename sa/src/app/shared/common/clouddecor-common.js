
require('./modules/validators');
require('./modules/directives');
require('./modules/filters');

(function () {
    "use strict";
    angular.module('clouddecor.common', ['clouddecor.validators', 'clouddecor.filters' ,'clouddecor.directives']);
})();