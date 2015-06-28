'use strict';
describe('App Configuration', function() {
    var UserSetting;
    beforeEach(module('app.kit'));
    beforeEach(inject(function(_UserSetting_) {
        UserSetting = _UserSetting_;
    }));
    it('have to set correct roleForCompany', function() {
        expect(UserSetting.roleForCompany).toEqual('profile');
    });
    it('have to set correct logoutStateRedirect', function() {
        expect(UserSetting.logoutStateRedirect).toEqual('app.home');
    });
});