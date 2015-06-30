'use strict';
/* global jasmine, moment*/
describe('Utils Service', function() {
    var utils, rootScope;
    beforeEach(module('core.utils'));
    beforeEach(inject(function($rootScope, _utils_) {
        utils = _utils_;
        rootScope = $rootScope;
    }));

    describe('reponse', function() {
        it('should return the methods', function() {
            expect(typeof utils.isImg).toEqual('function');
            expect(typeof utils.brStates).toEqual('function');
            expect(typeof utils.age).toEqual('function');
        });
    });

    describe('isImg: test if the url is an image', function() {
        it('should return result of a promise', function() {
            expect(utils.isImg('https://livejob.s3-sa-east-1.amazonaws.com/livejob-blue.png').$$state.status).toEqual(0);
        });
    });
    describe('age: convert date (en format) to years', function() {
        it('should return age', function() {
            moment.locale('en');
            expect(utils.age('1986-07-13')).toEqual(jasmine.stringMatching('years'));
        });
    });
    describe('brStates: return a list of states of Brazil', function() {
        it('needs to have name and value', function() {
            expect(utils.brStates()[0].name).toBeDefined();
            expect(utils.brStates()[0].value).toBeDefined();
        });
    });
});