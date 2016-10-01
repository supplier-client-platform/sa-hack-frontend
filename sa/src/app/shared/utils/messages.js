var $message = {};


/**
 * Success messages
 */
$message.POST_ADDED_SUCCESS = 'Post added successfully';
$message.POST_UPDATED_SUCCESS = 'Post updated successfully';
$message.POST_DELETED_SUCCESS = 'Post deleted successfully';

$message.PRODUCT_ADDED_SUCCESS = 'Product has been added';
$message.PRODUCT_DRAFT_ADDED_SUCCESS = 'Product has been added as draft';
$message.PRODUCT_UPDATED_SUCCESS = 'Product has been updated';
$message.PRODUCT_DRAFT_UPDATED_SUCCESS = 'Product has been updated as draft';
$message.PRODUCT_NOT_UPDATED = 'Nothing for update';
$message.PRODUCT_NOT_FOUND_ERR = 'No Products found';
$message.PRODUCT_DOWNLOAD_MAIL_SUCCESS = "Mail Sent Successfully";
$message.PRODUCT_DOWNLOAD_ERROR = "Something went wrong. Please try again";
$message.PRODUCT_DOWNLOAD_IMAGE_EMPTY = "Atleast one image should be selected to download";
//retailer
$message.RETAILER_ADDED_SUCCESS = 'Retailer registered successfully';

//account 
$message.RETAILER_USER_ADDED_SUCCESS = 'Retailer user added successfully';
$message.RETAILER_USER_EDITED_SUCCESS = 'Retailer user updated successfully';
$message.RETAILER_EDITED_SUCCESS = 'Retailer updated successfully';
$message.ACCOUNT_IMAGE_UPLOAD_SUCCESS = "Retailer store image uploaded successfully";

//journalist
$message.JOURNALIST_USER_ADDED_SUCCESS = 'Journalist user added successfully';

//cso
$message.PRODUCT_ACCEPT_SUCCESS = 'Product Accepted Successfully';
$message.PRODUCT_REJECT_SUCCESS = 'Product Rejected Successfully';
$message.RETAILER_ACCEPT_SUCCESS = 'Retailer Accepted Successfully';
$message.RETAILER_REJECT_SUCCESS = 'Retailer Rejected Successfully';

//brand
$message.BRAND_ADD_SUCCESS = 'Brand added successfully.';
$message.BRAND_PROFILE_FETCH_ERROR = "Brand not found";


/**
 * Information messages
 */
$message.POST_LIST_EMPTY_INFO = 'Posts not found';
$message.FORM_INVALID = 'Please enter mandatory fields to proceed';

//account
$message.RETAILER_USER_FETCH_ERROR = 'Retailer users not found.';
$message.RETAILER_PROFILE_FETCH_ERROR = 'Retailer profile not found.';



/**
 * Error messages
 */
//PRODUCT_DETAIL_LEAD_FAIL
$message.HTTP500_ERROR = 'Some error has occurred. Please try again';
$message.MARKET_PLACE_LIST_ERROR = 'Market places not found';
$message.MARKET_PLACE_ATTRIBUTES_ERROR = 'Market places attributes not found';
$message.CATEGORY_FETCH_ERROR = 'Can not fetch the category';

$message.COUNTRY_FETCH_ERROR = 'Countries not found.';
$message.CITY_FETCH_ERROR = 'Cities not found.';
$message.ROLES_FETCH_ERROR = 'User roles not found.';

$message.PRODUCT_NOT_FOUND = 'All the products has loaded';
$message.PRODUCT404_ERROR = 'Sorry, the requested product is not available';

//Product Edit
$message.PRODUCT_DETAIL_LEAD_FAIL = 'Some error has occurred. Please try again';

//account
$message.ACCOUNT_IMAGE_UPLOAD_ERROR = "Retailer store image upload error";
$message.CURRENCY_LIST_FETCH_ERROR = "Cannot fetch currency list.";
$message.CURRENCY_FETCH_ERROR = "Cannot fetch currency code.";

//subscription
$message.SUBSCRIPTION_PLAN_FETCH_ERROR = 'Subscription plan not found.';

//cso
$message.PRODUCT_FETCH_ERROR = "Product not found.";

//retailer
$message.RETAILER_LIST_NOT_FOUND = "Retailer Requests loading error.";

//brand
$message.USER_ROLE_NOT_FOUND = 'User Role not found.';
$message.FORM_INVALID = 'Please fill mandotory fields to proceed';


//ACL
$message.UNATHORIZED = "You don't have  required permissions.";


module.exports = $message;