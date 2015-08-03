'use strict';
angular.module('core.home').controller('$HomeCtrl', /*@ngInject*/ function($rootScope, $page, setting) {
    var vm = this;
    //
    // SEO
    //
    $page.title(setting.name + setting.titleSeparator + ' Home');

    //
    // Broadcast
    //
    $rootScope.$on('$LoginSuccess',function(ev, response){
    	console.log(response)
    });

    bootstrap();

    function bootstrap() {}
});