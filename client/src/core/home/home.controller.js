'use strict';
angular.module('core.home').controller('$HomeCtrl', /*@ngInject*/ function($rootScope, $page, $translate, $user, $state, $app, setting, api) {
    var vm = this;
    /**
     * image-cutter params
     */
    vm.imageCutterEndpointUrl = api.url + '/api/prize/image/';
    vm.imageCutterEndpointSuccess = function(response) {
        $mdDialog.hide();
        prize.banner = response.url;
        save(prize);
        //console.log('success 1', product.images[0].url)
    };
    vm.imageCutterEndpointFail = function(response) {
        $page.toast('Problema ao enviar imagem ' + response.message || response.error)
    };
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