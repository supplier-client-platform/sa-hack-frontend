require('./alphaNumeric');
require('./email');
require('./integer');
require('./match');
require('./number');
require('./resetParse');
require('./unique');

(function () {
    "use strict";
    angular.module('clouddecor.validators', [
        'cloudDecor.validators.alphaNumeric',
        'cloudDecor.validators.email',
        'cloudDecor.validators.integer',
        'cloudDecor.validators.match',
        'cloudDecor.validators.number',
        'cloudDecor.validators.resetParse',
        'cloudDecor.validators.unique'
    ]);
})();

