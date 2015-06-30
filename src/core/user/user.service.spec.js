'use strict';
describe('User', function() {
    var User;
    beforeEach(module('core.user'));
    beforeEach(inject(function(_User_) {
        User = _User_;
    }));
    describe('Constructor', function() {
        it('define current data and session data', function() {
            var user = new User();
            expect(user.currentData).toBeDefined();
            expect(user.sessionData).toBeDefined();
        });
    });
});