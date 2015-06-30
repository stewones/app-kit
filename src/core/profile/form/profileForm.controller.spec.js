'use strict';
/* global spyOn */
describe('Component <profile/form/profileForm> controller', function() {
    var $scope,
        $httpBackend,
        $timeout,
        requestHandler,
        vm,
        User,
        user,
        api,
        layout;
    beforeEach(module('core.profile'));
    beforeEach(inject(function($injector, $rootScope, $controller, _$auth_, _User_, _user_, _layout_, _Profile_, _setting_, _api_) {
        layout = _layout_;
        user = _user_;
        User = _User_;
        api = _api_;
        api.url = 'http://localhost:9000';
        $httpBackend = $injector.get('$httpBackend');
        $timeout = $injector.get('$timeout');
        requestHandler = $httpBackend.when('POST', 'http://localhost:9000/api/configs/education').respond({
            graduation: ['a', 'b', 'c'],
            schooling: ['d', 'e', 'f'],
            technical: ['g', 'h', 'i']
        });
        $scope = $rootScope.$new();

        bootstrap();
        vm = $controller('ProfileFormCtrl', {
            $scope: $scope,
            $auth: _$auth_,
            user: user,
            Profile: _Profile_,
            setting: _setting_,
            api: api
        });
    }));

    it('brazilian states', function() {
        expect(vm.states.length).toEqual(27);
    });

    describe('education', function() {
        it('needs to get education options when the current tab is graduation', function() {
            $scope.tabCurrent = 2;
            $httpBackend.flush();
            $timeout.flush();
            expect(vm.education).toBeTruthy();
        });
        it('sets the busy state when called', function() {
            $scope.tabCurrent = 2;
            $httpBackend.flush();
            expect(vm.educationLoading).toEqual(true);
        });
        it('turns off busy state on success', function() {
            $scope.tabCurrent = 2;
            $httpBackend.flush();
            $timeout.flush();
            expect(vm.educationLoading).toEqual(false);
        });
        it('toast on server error', function() {
            spyOn($page, 'toast');
            requestHandler.respond(500);
            $scope.tabCurrent = 2;
            $httpBackend.flush();
            $timeout.flush();
            expect($page.toast).toHaveBeenCalled();
        });
        it('needs to have graduation options', function() {
            $scope.tabCurrent = 2;
            $httpBackend.flush();
            expect(vm.education.graduation.length).toBeGreaterThan(1);
        });
        it('needs to have schooling options', function() {
            $scope.tabCurrent = 2;
            $httpBackend.flush();
            expect(vm.education.schooling.length).toBeGreaterThan(1);
        });
        it('needs to have technical options', function() {
            $scope.tabCurrent = 2;
            $httpBackend.flush();
            expect(vm.education.technical.length).toBeGreaterThan(1);
        });
    });

    //bootstrap app
    function bootstrap() {
        var currentUser = new User();
        currentUser.current('company', {
            _id: "555985696cedffcc5cb4131d",
            facebook: "144963895628176",
            name: "ES Grupo",
            positions: Array[45],
            ref: "default"
        });
        user.set(currentUser);
    }


});