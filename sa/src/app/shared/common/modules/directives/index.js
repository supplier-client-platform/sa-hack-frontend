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

