'use strict';
angular.module('core.page').controller('ToolbarMenuCtrl', /*@ngInject*/ function($rootScope, $mdBottomSheet) {
    var vm = this;
    $rootScope.$on('AppMenuOpened', function() {
        $mdBottomSheet.hide();
    });
    $rootScope.$on('CompanyIdUpdated', function() {
        $mdBottomSheet.hide();
    });
    vm.showFilters = function() {
        $mdBottomSheet.show({
            templateUrl: 'app/finder/filter/finderFilterMobile.tpl.html',
            controller: 'FinderFilterCtrl',
            controllerAs: 'vm',
            //targetEvent: $event,
            //parent: '.finder-wrapper',
            locals: {},
            //scope: ''
            //preserveScope: true,
            disableParentScroll: false
        }).then(function() {});
    }
    //
    // Events
    //
    //
    // Bootstrap
    //
    //
    bootstrap();

    function bootstrap() {}
})