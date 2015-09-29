'use strict';
angular.module('core.home').controller('$HomeCtrl', /*@ngInject*/ function($rootScope, $page, $translate, $user, $state, $app, setting) {
    var vm = this;
    //
    // SEO
    //
    $page.title(setting.name + setting.titleSeparator + ' Home');
    bootstrap();
    function bootstrap() {
        if ($state.current.name === 'app.home-secured') {
            // $app.storage('session').set({
            //     locationRedirect: '/home-secured/'
            // });
           // $app.storage('session').destroy();
        }
    }
});