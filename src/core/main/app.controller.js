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
 * @requires page.module.factory:$page
 * @requires user.module.service:$User
 * @requires user.module.factory:$user
 * @requires core.login.$loginProvider
 * @requires page.module.factory:$menu
 **/
angular.module('app.kit').controller('$AppCtrl', /*@ngInject*/ function(setting, $rootScope, $scope, $state, $location, $mdSidenav, $timeout, $auth, $page, User, user, enviroment, menu, $login) {
    var vm = this;
    vm.enviroment = enviroment;
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
    // Watchers
    //
    //
    // Events
    //  
    $rootScope.$on('CompanyIdUpdated', function(e, nv, ov) {
        if (nv != ov) {
            //quando alterar company, atualizar factory  
            var company = user.instance.filterCompany(nv);
            user.instance.current('company', company);
            user.instance.session('company', {
                _id: company._id,
                name: company.name
            });
            menu.api().close();
            bootstrap();
        }
    });
    $rootScope.$on('AccountUpdated', function() {
        bootstrap();
    });
    $rootScope.$on('Unauthorized', function() {
        user.instance.destroy();
    });
    //
    // BOOTSTRAP
    //  
    bootstrap(true);

    function bootstrap(withUser) {
        //nonWww2www();
        //http2https(); //@bug - bug com _escaped_fragment_
        if (withUser) {
            var newUser = new User();
            user.set(newUser);
        }
        vm.user = user.instance;
        vm.$page = $page;
        vm.setting = setting;
        vm.year = moment().format('YYYY');
        vm.state = $state;
        vm.isAuthed = $auth.isAuthenticated;
        vm.logout = logout;
        vm.menu = menu.api();
        vm.loginConfig = $login.config;
        vm.iframe = $location.hash() === 'iframe' ? true : false;
    }
    //
    // Behaviors
    //
    function logout() {
        $mdSidenav('left').close();
        $timeout(function() {
            user.instance.destroy(true);
            bootstrap(true);
        }, 500);
    }
    //
    // Redirect http to https //@bug - bug com _escaped_fragment_ - redirecionando via CF
    // https://github.com/esgrupo/livejob/issues/15
    //
    // function http2https() {
    //     //tenho https configurado
    //     if (setting.https.length) {
    //         //host esta na configuração
    //         if (_.indexOf(setting.https, $location.host().replace(/www./g, '')) != -1) {
    //             //protocolo atual não é seguro            
    //             if ($location.protocol() !== 'https') {
    //                 //estou na home #15 bug com _escaped_fragment_
    //                 if ($state.current.name === 'app.home') {
    //                     //bingo
    //                     $window.location.href = $location.absUrl().replace(/http/g, 'https');
    //                 }
    //             }
    //         }
    //     }
    // }
    //
    // Redirect non-www to www
    // https://github.com/esgrupo/livejob/issues/17
    //
    function nonWww2www() {
        //redirecionar www
        if (setting.redirWww) {
            //se estiver em produção
            if (enviroment === 'production') {
                if (!hasWww()) {
                    $window.location.href = 'https://www.' + $location.host() + $location.path();
                }
            }
        }
    }

    function hasWww() {
        var www = new RegExp("www.");
        return www.test($location.host());
    }
})