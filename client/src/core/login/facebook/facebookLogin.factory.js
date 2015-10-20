'use strict';
angular.module('facebook.login').factory('fbLogin', /*@ngInject*/ function($rootScope, $auth, $mdToast, $http, Facebook, $user, $page, $login, api, setting) {
    return {
        go: go
    }

    function go(cbSuccess, cbFail) {
        $page.load.init();
        Facebook.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                return loginHandler(cbSuccess, cbFail);
            } else {
                Facebook.login(function(response) {
                    if (response.error || !response.status || !response.authResponse) {
                        $page.load.done();
                        return;
                    }
                    return loginHandler(cbSuccess, cbFail);
                }, {
                    scope: setting.facebook.scope || 'email'
                });
            }
        })
    }

    function me() {
        return Facebook.api('/me', function() {
            //$scope.user = response;
        });
    }

    function loginHandler(cbSuccess, cbFail) {
        var onSuccess = function(fbUser) {
            var onSuccess = function(response) {
                $page.load.done();
                $user.instantiate(response.data.user, true, response.data.new ? msg : false, function() {
                    var msg = false;
                    var gender = (response.data.user.profile && response.data.user.profile.gender && response.data.user.profile.gender === 'F') ? 'a' : 'o';
                    if (response.data.new) {
                        msg = 'Olá ' + response.data.user.profile.firstName + ', você entrou. Seja bem vind' + gender + ' ao ' + setting.name;
                    }
                    $rootScope.$emit('$LoginSuccess', response.data);
                    $auth.setToken(response.data.token);
                    if (cbSuccess) cbSuccess();
                });
            }
            var onFail = function(response) {
                $page.load.done();
                $mdToast.show($mdToast.simple().content(response.data && result.data.error ? response.data.error : 'error').position('bottom right').hideDelay(3000))
                if (cbFail) cbFail()
            }
            var gender = '';
            gender = fbUser.gender && fbUser.gender === 'female' ? 'F' : gender;
            $http.post(api.url + '/auth/facebook', angular.extend({
                provider: 'facebook',
                id: fbUser.id,
                firstName: fbUser.first_name,
                lastName: fbUser.last_name,
                email: fbUser.email,
                gender: gender,
                applicant: true
            }, $login.signupParams)).then(onSuccess, onFail);
        }
        var onFail = function() {}
        me().then(onSuccess, onFail);
    }
})