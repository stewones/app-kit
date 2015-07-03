(function() {
    /**
     * App Seed Sample
     */
    'use strict';
    angular.module('app.seed', ['app.kit'])
        /**
         * Custom App Config
         */
        .config( /*@ngInject*/ function($loginProvider, $appProvider, $stateProvider) {
            //$appProvider.layoutUrl('layout.tpl.html');
            //$appProvider.toolbarUrl('toolbar.tpl.html');
            //$appProvider.sidenavUrl('sidenav.tpl.html');
            $loginProvider.templateUrl('login.tpl.html');
        })
        /**
         * Custom Login Ctrl
         */
        .controller('LoginCtrl', /*@ngInject*/ function LoginCtrl() {
            var vm = this;
            vm.hello = '"As pessoas não sabem o que querem, até mostrarmos a elas."';
        });
})();