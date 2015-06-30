(function() {
    /**
     * Sample app
     */
    'use strict';
    angular.module('esgrupo.app', ['app.kit']).controller('LoginCtrl', ['$Profile', LoginCtrl]).config(['$loginProvider', '$appProvider', '$stateProvider', TestConfig]);

    function LoginCtrl($Profile) {
        var vm = this;
        vm.hello = '"As pessoas não sabem o que querem, até mostrarmos a elas."';
    }

    function TestConfig($loginProvider, $appProvider, $stateProvider) {
        //
        // Configs
        //        
        //$appProvider.layoutUrl('toolbar.html');
        //$appProvider.toolbarUrl('toolbar.html');
        //$appProvider.sidenavUrl('toolbar.html');
        $loginProvider.templateUrl('login.html');
    }
})();