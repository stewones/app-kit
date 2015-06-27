'use strict';
angular.module('profile.module').controller('ProfileCtrl', /*@ngInject*/ function(companySession, companyCurrent, $rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, utils, layout, user, setting) {
    var vm = this;
    vm.companySession = companySession;
    vm.companyCurrent = companyCurrent;
    //
    // SEO
    //
    layout.setTitle(setting.title);
    layout.setDescription(setting.description);
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