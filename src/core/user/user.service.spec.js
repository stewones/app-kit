'use strict';
describe('User', function() {
    var User;
    beforeEach(module('core.user'));
    beforeEach(inject(function(_$User_) {
        User = _$User_;
    }));
    describe('Constructor', function() {
        it('define current data and session data', function() {
            var user = new User();
            expect(user.currentData).toBeDefined();
            expect(user.sessionData).toBeDefined();
        });
    });
});