'use strict';
angular.module('core.home').controller('$HomeCtrl', /*@ngInject*/ function($page, setting) {
    var vm = this;
    //
    // SEO
    //
    $page.title(setting.name + setting.titleSeparator + ' Home');
    bootstrap();

    function bootstrap() {}
});