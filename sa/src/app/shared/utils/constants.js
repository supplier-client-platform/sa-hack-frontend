var $global = {};

$global.SECTION = 'pressdecor';
$global.ITEMS_PER_PAGE = '20';

/**
 * HTTP response codes
 */
$global.HTTP200 = 200;
$global.HTTP201 = 201;
$global.HTTP204 = 204;
$global.HTTP400 = 400;
$global.HTTP401 = 401;
$global.HTTP403 = 403;
$global.HTTP404 = 404;
$global.HTTP422 = 422;
$global.HTTP500 = 500;

/**
 * Alert types
 */
$global.INFO = 'info';
$global.ERROR = 'error';
$global.SUCCESS = 'success';
$global.WARNING = 'warning';

/**************************** User *******************************************/


/**
 * Action types
 */
$global.ACTIONS = {
    ADD: 'add',
    EDIT: 'edit'
};

/**************************** Subscription ***********************************/

/**
 * solution types
 */
$global.SOLUTIONS = {
    CLOUDDECOR: 'clouddecor',
    MARKETPLACE: 'marketplace'
};

/**************************** Product ****************************************/
$global.COLOR_VARIANT = 'color';

$global.COLORS = [
    { 'code': 'ed8477', 'class': 'bg-1' },
    { 'code': 'd24036', 'class': 'bg-2' },
    { 'code': 'a52618', 'class': 'bg-3' },
    { 'code': 'c24b21', 'class': 'bg-4' },
    { 'code': '70201c', 'class': 'bg-5' },
    { 'code': 'fbf298', 'class': 'bg-6' },
    { 'code': 'fade4b', 'class': 'bg-7' },
    { 'code': 'f5bb41', 'class': 'bg-8' },
    { 'code': 'f2a53a', 'class': 'bg-9' },
    { 'code': 'ee792f', 'class': 'bg-10' },
    { 'code': 'c34c21', 'class': 'bg-11' },
    { 'code': 'f7cdf3', 'class': 'bg-12' },
    { 'code': 'a94c8a', 'class': 'bg-13' },
    { 'code': '6d2855', 'class': 'bg-14' },
    { 'code': '3d1623', 'class': 'bg-15' },
    { 'code': '502e15', 'class': 'bg-16' },
    { 'code': '605347', 'class': 'bg-17' },
    { 'code': 'd1f3b6', 'class': 'bg-18' },
    { 'code': 'cdf381', 'class': 'bg-19' },
    { 'code': '78c562', 'class': 'bg-20' },
    { 'code': '629055', 'class': 'bg-21' },
    { 'code': '2e5025', 'class': 'bg-22' },
    { 'code': '2e6767', 'class': 'bg-23' },
    { 'code': 'e1fbfe', 'class': 'bg-24' },
    { 'code': 'd0e8f2', 'class': 'bg-25' },
    { 'code': '5aa2b0', 'class': 'bg-26' },
    { 'code': '3d8ab2', 'class': 'bg-27' },
    { 'code': '293a4e', 'class': 'bg-28' },
    { 'code': '1e2d3d', 'class': 'bg-29' },
    { 'code': '131b26', 'class': 'bg-30' },
    { 'code': '12131a', 'class': 'bg-31' },
    { 'code': 'acacac', 'class': 'bg-32' }
];

$global.PRODUCT_SAVE = 'save';
$global.PRODUCT_SAVE_DRAFT = 'save_draft';
$global.PRODUCT_EDIT = 'edit';
$global.PRODUCT_EDIT_DRAFT = 'edit_draft';

$global.PRODUCT_IMAGE = 'image';
$global.PRODUCT_NOT_FOUND = 'PRD006';

/******** Special characters to set as alpha numeric values *************/
$global.CHARACTERS = {
    'UNDERSCORE': '_',
    'COMMA': ',',
    'SPACE': ' ',
    'DOT': '.',
    'SLASH': '/',
    'AMPERSAND': '&',
    'SINGLE-QUOTE': '\'',
    'QUOTE': '"',
    'ASTERISK': '*',
    'AT': '@',
    'PLUS': '+',
    'HASH': '#',
    'QUESTION-MARK': '?',
    'HYPHEN': '-'
};
module.exports = $global;