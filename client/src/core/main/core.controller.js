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
        // Persists current location to execute redirection after login
        // - Only if server status is 401
        //
        if (status === 401) {
            $app.storage('session').set({
                locationRedirect: $location.url()
            });
        }
        $rootScope.$Unauthorized = true;
        $user.destroy(function() {
            window.location.href = '/login/lost/session/';
        });
    });
    //
    // When user in...
    //
    $rootScope.$on('$LoginSuccess', function(ev, response) {
        var locationRedirect = $app.storage('session').get().locationRedirect;
        if (locationRedirect && locationRedirect != '/login/') {
            //
            // Reset locationRedirect
            //
            $app.storage('session').set({
                locationRedirect: ''
            });
            //
            // Do redirection
            //
            window.location = locationRedirect;
        }
        //
        // Reset the $rootScope.$Unauthorized
        //
        $rootScope.$Unauthorized = false;
        $location.path($user.setting.loginSuccessRedirect);
    });
    //
    // BOOTSTRAP with a new user
    //  
    bootstrap(true);

    function bootstrap(withNewUser) {
        //
        // boot with new user
        //
        if (withNewUser) {
            //
            // boot from storage
            //
            if ($sessionStorage.user && $sessionStorage.user.id && $auth.getToken()) {
                $user.instantiate($sessionStorage.user, false, false, function() {
                    boot();
                });
            } else {
                //
                // user not present, ensure that we dont have token
                //
                $user.destroy(function() {
                    //
                    // then instantiate a new blank user
                    //
                    $user.instantiate({}, false, false, function() {
                        boot();
                    });
                });
            }
        } else {
            boot();
        }
        //
        // export default states and behaviors to view
        //
        function boot() {
            app.user = function() { //@todo break changes
                return $user.instance();
            }
            app.page = function() { //@todo break changes
                return $page;
            }
            app.state = function() { //@todo break changes
                return $state;
            }
            app.logout = function() { //@todo break changes
                return logout();
            }
            app.menu = function() { //@todo break changes
                return $menu.api();
            }
            app.setting = function() { //@todo break changes
                return setting;
            }
            app.enviroment = function() { //@todo break changes
                return enviroment
            }
            app.year = function() { //@todo break changes
                return moment().format('YYYY');
            };
            //
            // Warning
            //
            var warning = $app.storage('session').get().warning;
            if (warning) {
                $page.toast(warning, 5000, 'top right');
                $app.storage('session').set({
                    warning: ''
                });
            }
        }
    }
    //
    // Behaviors
    //
    function logout() {
        $user.logout(true, function() {
            // if ($state.current.name != 'app.home') {
            //     $timeout(function() {
            //         $page.toast('Você será redirecionado em 5 segundos...');
            //         $timeout(function() {
            //             window.location = '/';
            //         }, 5000);
            //     }, 2000);
            // }
        });
    }
})