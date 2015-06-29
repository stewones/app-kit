'use strict';
angular.module('profile.module').controller('ProfileCtrl', /*@ngInject*/ function(companySession, companyCurrent, $rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, utils, $page, user, setting) {
    var vm = this;
    vm.companySession = companySession;
    vm.companyCurrent = companyCurrent;
    //
    // SEO
    //
    $page.title(setting.title);
    $page.description(setting.description);
    //
    // Events
    //
    $rootScope.$on('CompanyIdUpdated', function() {});
    //
    // Watchers
    //
    //
    // Bootstrap
    //
    //
    bootstrap();

    function bootstrap() {}
})