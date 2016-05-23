'use strict';
angular.module('<%= module %>').controller('<%= nameStart %>', /*@ngInject*/ function ($page, setting) {
    var vm = this;
    //
    // SEO
    //
    $page.title(setting.name + setting.titleSeparator + ' Home');
    bootstrap();

    function bootstrap() { }
});