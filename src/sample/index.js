(function() {
    /**
     * Sample app
     */
    'use strict';
    angular.module('esgrupo.app', ['app.kit']).controller('LoginCtrl', [LoginCtrl]).config(['$loginProvider', '$appProvider', '$stateProvider', TestConfig]);

    function LoginCtrl() {
        var vm = this;
        vm.hello = '"As pessoas não sabem o que querem, até mostrarmos a elas."';
    }

    function TestConfig($loginProvider, $appProvider, $stateProvider) {
        //
        // Login Config
        //
        $loginProvider.templateUrl('login.html');
        $appProvider.toolbarUrl('toolbar.html');
  
    }
})();