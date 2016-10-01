/**
* @desc this directive is for check the difference of two elements and apply a css class to show the difference
* @example <input diff="user.name"></input>
*/

angular
    .module('cloudDecor.directive.diff',[])
    .directive('diff', diff);

function diff() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attributes, ngModelCtrl) {
             
            if(scope.vm.editedView){
                var array = attributes.diff.split('.');
            
                var new_val = scope.vm.newVersion;
                var old_val = scope.vm.oldVersion;
                
                angular.forEach(array, function (i) {
                    new_val = new_val[i];
                    old_val = old_val[i];
                });
                
                if(!angular.equals(new_val, old_val)){
                    element.addClass('diff');
                }  
            }    
        }
    };
}