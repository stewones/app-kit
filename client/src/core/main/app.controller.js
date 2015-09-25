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
angular.module('core.app').controller('$AppCtrl', /*@ngInject*/ function(setting, $rootScope, $scope, $state, $location, $mdSidenav, $timeout, $auth, $page, $User, $user, enviroment, $menu, $login, $app) {
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
        // Persistir o local atual
        // para redirecionamento após o login
        // - somente se status 401
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
            window.location.href = '/login-session/';
        }
    });
    //
    // Comportamentos para quando o usuário entrar
    //
    $rootScope.$on('$LoginSuccess', function(ev, response) {
        //
        // Redirecionar usuario para alguma rota pre-estabelecida
        //
        var appSession = $app.storage('session').get();
        if (appSession && appSession.locationRedirect && appSession.locationRedirect != '/login/') {
            //
            // Redirecionar o caboclo
            //
            $location.path(appSession.locationRedirect);
            //
            // Resetar o locationRedirect
            //
            $app.storage('session').set({
                locationRedirect: ''
            })
        }
        //
        // Zerar o $rootScope.$Unauthorized
        //
        $rootScope.$Unauthorized = false;
    });
    //
    // BOOTSTRAP
    //  
    bootstrap(true);

    function bootstrap(withUser) {
        if (withUser) {
            var newUser = new $User();
            $user.set(newUser);
        }
        app.user = $user.instance();
        app.page = $page; //@todo break
        app.setting = setting;
        app.year = moment().format('YYYY');
        app.state = $state;
        app.isAuthed = $auth.isAuthenticated;
        app.logout = logout;
        app.menu = $menu.api();
        app.iframe = $location.hash() === 'iframe' ? true : false;
    }
    //
    // Behaviors
    //
    function logout() {
        $mdSidenav('left').close(); //@todo factory
        //$timeout(function() {
        var userInstance = $user.instance();
        if (typeof userInstance.destroy === 'function') $user.instance().destroy(true);
        //bootstrap(true);
        //}, 500);
    }
})