'use strict';
/* global spyOn */
describe('<opt-out> component controller', function() {
    var $controller,
        $location,
        $scope, vm;
    beforeEach(module('lojarocks'));
    beforeEach(inject(function($injector, _$controller_, _$location_) {
        $controller = _$controller_;
        $location = _$location_
        $scope = {
            actionLocation: '/my/awesome/location/path/'
        }
        vm = $controller('ListCardCtrl', {
            $scope: $scope,
            $location: $location
        });
    }));
    it('should change location when $scope.callAction is called', function() {
        spyOn($location, 'path');
        $scope.callAction();
        expect($location.path).toHaveBeenCalledWith('/my/awesome/location/path/');
    });
});