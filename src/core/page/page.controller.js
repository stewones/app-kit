'use strict';
angular.module('page.module').controller('$PageCtrl', /*@ngInject*/ function($page, setting) {
    var vm = this;
    //
    // SEO
    //
    $page.title(setting.name + setting.titleSeparator + ' Home');
    bootstrap();

    function bootstrap() {}
});