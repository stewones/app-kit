'use strict';
/* global moment */
/**
 * @ngdoc object
 * @name app.kit.controller:$AppCtrl
 * @description
 * Controlador da aplicação
 * @requires setting
 * @requires environment
 * @requires $rootScope
 * @requires $scope
 * @requires $state
 * @requires $location
 * @requires $mdSidenav
 * @requires $timeout
 * @requires $auth
 * @requires core.page.factory:$page
 * @requires core.user.service:$User
 * @requires core.user.factory:$user
 * @requires core.login.$loginProvider
 * @requires core.page.factory:$menu
 **/
angular.module('core.app').controller('$AppCtrl', /*@ngInject*/ function(setting, $rootScope, $scope, $state, $location, $mdSidenav, $timeout, $auth, $page, $User, $user, enviroment, $menu, $login, $app, $sessionStorage) {
    var app = this;
    app.enviroment = enviroment;
    //
    // SEO
    //
    $page.title(setting.title);
    $page.description(setting.description);
    //
    // OPEN GRAPH
    //
    $page.ogLocale(setting.ogLocale);
    $page.ogSiteName(setting.ogSiteName);
    $page.ogTitle(setting.ogTitle);
    $page.ogDescription(setting.ogDescription);
    $page.ogUrl(setting.ogUrl);
    $page.ogImage(setting.ogImage);
    $page.ogSection(setting.ogSection);
    $page.ogTag(setting.ogTag);
    //
    // Moment
    //
    moment.locale('pt_BR');
    //
    // Storage defaults
    //
    // $localStorage.$default({});
    // $sessionStorage.$default({
    //     user: {}
    // });
    //
    // Events
    //  
    $rootScope.$on('$AppReboot', function() {
        bootstrap();
    });
    $rootScope.$on('$CompanyIdUpdated', function(e, nv, ov) {
        if (nv != ov) {
            //quando alterar company, atualizar factory  
            var company = $user.instance().filterCompany(nv);
            $user.instance().current('company', company);
            $user.instance().session('company', {
                _id: company._id,
                name: company.name
            });
            $menu.api().close();
            bootstrap();
        }
    });
    $rootScope.$on('$Unauthorized', function(ev, status) {
        //
        // Persists current location to execute redirection after login
        // - Only if server status is 401
        //
        if (status === 401) {
            $app.storage('session').set({
                locationRedirect: $location.url()
            });
        }
        $rootScope.$Unauthorized = true;
        var userInstance = $user.instance();
        if (typeof userInstance.destroy === 'function') {
            $user.instance().destroy();
            window.location.href = '/login/lost/session/';
        }
    });
    //
    // When user in...
    //
    $rootScope.$on('$LoginSuccess', function(ev, response) {
        var appSession = $app.storage('session').get();
        if (appSession && appSession.locationRedirect && appSession.locationRedirect != '/login/') {
            //
            // Do redirection
            //
            $location.path(appSession.locationRedirect);
            //
            // Reset locationRedirect
            //
            $app.storage('session').set({
                locationRedirect: ''
            })
        }
        //
        // Reset the $rootScope.$Unauthorized
        //
        $rootScope.$Unauthorized = false;
    });
    //
    // BOOTSTRAP with a new user
    //  
    bootstrap(true);

    function bootstrap(withNewUser) {
        if (withNewUser) {
            $user.instantiate({}, false, false, function() {
                boot();
            });
        } else {
            boot();
        }
        function boot() {
            app.user = $user; //@todo break changes
            app.page = $page; //@todo break changes
            app.setting = setting;
            app.year = moment().format('YYYY');
            app.state = $state;
            app.isAuthed = $auth.isAuthenticated;
            app.logout = logout;
            app.menu = $menu.api();
            app.iframe = $location.hash() === 'iframe' ? true : false;
        }
    }
    //
    // Behaviors
    //
    function logout() {
        $mdSidenav('left').close(); //@todo factory to avoid console log warning
        $user.destroy(true);
    }
})