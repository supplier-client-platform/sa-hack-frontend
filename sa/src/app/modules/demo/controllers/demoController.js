angular.module('sa-hack.demo.demoController', [])
    .controller('DemoController', DemoController);


function DemoController(CommonService) {
    CommonService.log("demo works");
}
 