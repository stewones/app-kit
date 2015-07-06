(function() {
    /**
     * App Seed Sample
     */
    'use strict';
    angular.module('app.seed', ['core.app'])
        /**
         * 1 - App Config
         */
        .config( /*@ngInject*/ function($loginProvider, $appProvider, $stateProvider, $menuProvider) {
            //$appProvider.layoutUrl('layout.tpl.html');
            //$appProvider.toolbarUrl('toolbar.tpl.html');
            //$appProvider.sidenavUrl('sidenav.tpl.html');
            $appProvider.toolbarTitleUrl('toolbarTitle.tpl.html');
            $appProvider.logoWhite('https://livejob.s3.amazonaws.com/livejob-white.png');
            $loginProvider.templateUrl('login.tpl.html');
  /*          $menuProvider.set({
                name: 'Teste',
                type: 'link',
                icon: 'fa fa-street-view',
                url: '/profile/',
                state: 'app.profile'
            });*/
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