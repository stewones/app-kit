'use strict';
describe('App Configuration', function() {
    var UserSetting;
    beforeEach(module('core.app'));
    beforeEach(inject(function(_$user_) {
        UserSetting = _$user.setting_;
    }));
    it('have to set correct roleForCompany', function() {
        expect(UserSetting.roleForCompany).toEqual('profile');
    });
    it('have to set correct logoutStateRedirect', function() {
        expect(UserSetting.logoutStateRedirect).toEqual('app.home');
    });
});