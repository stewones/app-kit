(function() {
    /**
     * App Seed Sample
     */
    'use strict';
    angular.module('app.seed', ['app.kit'])
        /**
         * 1 - App Config
         */
        .config( /*@ngInject*/ function($loginProvider, $appProvider, $stateProvider, $pageProvider) {
            //$appProvider.layoutUrl('layout.tpl.html');
            //$appProvider.toolbarUrl('toolbar.tpl.html');
            //$appProvider.sidenavUrl('sidenav.tpl.html');
            $loginProvider.templateUrl('login.tpl.html');
            $pageProvider.logoWhite('https://livejob.s3.amazonaws.com/livejob-white.png');

        })
        /**
         * 2 - App Run
         */
        .run( /*@ngInject*/ function() {
            //do stuff
        })

    /**
     * Custom Login Ctrl
     */
    .controller('LoginCtrl', /*@ngInject*/ function LoginCtrl($page) {
        var vm = this;
        vm.hello = '"As pessoas não sabem o que querem, até mostrarmos a elas."';
    });
})();