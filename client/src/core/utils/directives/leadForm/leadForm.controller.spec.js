'use strict';
/* global spyOn */
describe('Component <helpers/directive/leadForm> controller', function() {
    var $controller,
        $httpBackend,
        $scope,
        vm,
        api,
        $page,
        requestHandler;
    beforeEach(module('livejob'));
    beforeEach(inject(function($injector, _$controller_, _api_, _$page_) {
        api = _api_;
        layout = _$page_;
        api.url = 'http://localhost:9000';
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');
        requestHandler = $httpBackend.whenPOST('http://localhost:9000/api/leads').respond({
            __v: 0,
            _id: "555947e1dc96cc201c5d9369",
            company: "ES Grupo",
            created: "2015-05-17T19:57:28.000Z",
            email: "hi@stpa.co",
            name: "Stewan",
            phone: "111111111"
        });
        $scope = {};
        vm = $controller('LeadFormCtrl', {
            $scope: $scope,
            api: api
        });

        $scope.lead = {
            name: 'Stewan',
            email: 'hi@stpa.co',
            company: 'ES Grupo',
            phone: '111111111'
        };
    }));
    describe('register action', function() {
        it('sets the busy state when called', function() {
            $scope.register();
            expect(vm.busy).toEqual(true);
        });
        it('turn off busy state on success', function() {
            $scope.register();
            $httpBackend.flush();
            expect(vm.busy).toEqual(false);
        });
        it('clean scope lead details on success', function() {
            $scope.register();
            $httpBackend.flush();
            expect($scope.lead).toEqual({});
        });
        it('toast on server error', function() {
            spyOn($page, 'toast');
            requestHandler.respond(500);
            $scope.register();
            $httpBackend.flush();
            expect($page.toast).toHaveBeenCalled();
        });
    });
});