'use strict';
angular.module('facebook.login').config(function(FacebookProvider, setting) {
    FacebookProvider.init({
        version: 'v2.3',
        appId: setting.facebook.appId,
        locale: 'pt_BR'
    });
});