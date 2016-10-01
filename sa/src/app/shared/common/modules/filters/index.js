require('./capitalize');
require('./languageSplit');


(function () {
    "use strict";
    angular.module('clouddecor.filters', [
        'cloudDecor.filters.capitalize',
        'cloudDecor.filters.language_split'
    ]);
})();