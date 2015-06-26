'use strict';
angular.module('login.module').controller('RegisterFormCtrl', /*@ngInject*/ function($scope, $auth, $mdToast, user, layout, setting) {
    $scope.register = register;
    $scope.sign = {};

    function register(sign) {
        layout.load.init();
        var onSuccess = function(result) {
            layout.load.done();
            user.instance.init(result.data.user, true, 'Olá ' + result.data.user.profile.firstName + ', você entrou para o ' + setting.name, 10000);
        }
        var onError = function(result) {
            layout.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.error ? result.data.error : 'server away').position('bottom right').hideDelay(10000))
        }
        $auth.signup({
            firstName: sign.firstName,
            lastName: sign.lastName,
            email: sign.email,
            password: sign.password,
            provider: 'local'
        }).then(onSuccess, onError);
    }

})