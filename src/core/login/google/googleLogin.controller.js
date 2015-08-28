'use strict';
/* global gapi */
angular.module('google.login').controller('GoogleLoginCtrl', /*@ngInject*/ function($auth, $scope, $http, $mdToast, $state, $page, $user, setting, api) {
    var vm = this;
    vm.clientId = setting.google.clientId;
    vm.language = setting.google.language;
    $scope.$on('event:google-plus-signin-success', function( /*event, authResult*/ ) {
        // Send login to server or save into cookie
        gapi.client.load('plus', 'v1', apiClientLoaded);
    });
    $scope.$on('event:google-plus-signin-failure', function( /*event, authResult*/ ) {
        // @todo Auth failure or signout detected
    });

    function apiClientLoaded() {
        gapi.client.plus.people.get({
            userId: 'me'
        }).execute(handleResponse);
    }

    function handleResponse(glUser) {
        login(glUser);
    }

    function login(glUser) {
        $page.load.init();
        var onSuccess = function(response) {
            $page.load.done();
            var msg = false;
            var gender = (response.data.user.profile && response.data.user.profile.gender && response.data.user.profile.gender === 'F') ? 'a' : 'o';
            if (response.data.new) msg = 'Olá ' + response.data.user.profile.firstName + ', você entrou. Seja bem vind' + gender + ' ao ' + setting.name;
            $auth.setToken(response.data.token);
            var userInstance = $user.instance();
            if (typeof userInstance.init === 'function') $user.instance().init(response.data.user, true, msg);
        }
        var onFail = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.error ? result.data.error : 'error').position('bottom right').hideDelay(3000))
        }
        $http.post(api.url + '/auth/google', {
            provider: 'google',
            id: glUser.id,
            firstName: glUser.name.givenName,
            lastName: glUser.name.familyName,
            email: glUser.emails[0].value,
            gender: glUser.gender
        }).then(onSuccess, onFail);
    }
})