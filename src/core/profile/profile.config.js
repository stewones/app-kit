'use strict';
angular.module('core.profile').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider, $menuProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.profile', {
        protected: true,
        url: '/profile/',
        views: {
            'content': {
                templateUrl: 'core/profile/profile.tpl.html',
                controller: '$ProfileCtrl as vm'
            }
        },
        resolve: {
            authed: /*@ngInject*/ function($auth, $location) {
                if (!$auth.isAuthenticated()) {
                    $location.path('/login/');
                    return false;
                } else {
                    return true;
                }
            },
            companySession: /*@ngInject*/ function($state, user) {
                var userInstance = $user.instance.session('company');
                if (userInstance && userInstance.ref) {
                    $state.go('app.landing', {
                        ref: userInstance.ref
                    });
                    return true;
                }
                return false;
            },
            companyCurrent: /*@ngInject*/ function($location, $timeout, $user, layout) {
                if (!$user.instance.current('company') || !$user.instance.current('company')._id) {
                    $page.toast('Acesse o LiveJob de alguma empresa para criar conexões', 10000);
                    $timeout(function() {
                        $location.path('/');
                    }, 1000)
                    return false;
                }
                return true;
            },
            closeMenu: /*@ngInject*/ function($timeout, $auth, $menu) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        $menu.api().close();
                    }, 500)
                }
            }
        }
    });
    //$urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(true);
    //
    // Set Menu
    //
    $menuProvider.set({
        name: 'Perfil',
        type: 'link',
        icon: 'fa fa-street-view',
        url: '/profile/',
        state: 'app.profile'
    });
    //
    // Set Toolbar Menu
    //
    // $menuProvider.setToolbarMenu({
    //     id: 'filtros',
    //     name: 'Filtros',
    //     type: 'action',
    //     icon: 'fa fa-sliders'
    // });
});