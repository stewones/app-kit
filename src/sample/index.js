(function() {
    /**
     * App Seed Sample
     */
    'use strict';
    angular.module('app.seed', ['app.kit']).controller('LoginCtrl', [LoginCtrl]);

    function LoginCtrl() {
        var vm = this;
        vm.hello = '"As pessoas não sabem o que querem, até mostrarmos a elas."';
    }
})();