'use strict';
angular.module('core.login').controller('RegisterFormCtrl', /*@ngInject*/ function($rootScope, $scope, $auth, $mdToast, $user, $page, $login, setting) {
    $scope.register = register;
    $scope.sign = {};

    function register(sign) {
        $page.load.init();
        var onSuccess = function(result) {
            var msg = 'Olá ' + result.data.user.profile.firstName + ', você entrou para ' + setting.name;
            if ($login.config.signupWelcome) {
                msg = $login.config.signupWelcome.replace('@firstName', result.data.user.profile.firstName).replace('@appName', setting.name);
            }
            $user.instantiate(result.data.user, true, msg, function() {
                $rootScope.$emit('$LoginSuccess', result.data);
                $page.load.done();
            });
        }
        var onError = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.error ? result.data.error : 'error').position('bottom right').hideDelay(10000))
        }
        $auth.signup(angular.extend({
            firstName: sign.firstName,
            lastName: sign.lastName,
            email: sign.email,
            password: sign.password,
            provider: 'local'
        }, $login.signupParams)).then(onSuccess, onError);
    }
})