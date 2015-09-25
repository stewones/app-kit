'use strict';
/* global $ */
describe('Component <helpers/directive/leadForm> directive', function() {
    var $compile,
        $rootScope,
        element;
    beforeEach(module('livejob'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile('<lead-form label="Tenho Interesse"></lead-form>')($rootScope);
        $rootScope.$digest();
    }));
    it('needs to have 4 inputs', function() {
        expect(element.find('input').length).toEqual(4);
    });
    it('input name', function() {
        expect($(element).find('input[name="name"]').length).toEqual(1);
    });
    it('input email', function() {
        expect($(element).find('input[name="email"]').length).toEqual(1);
    });
    it('input company name', function() {
        expect($(element).find('input[name="company"]').length).toEqual(1);
    });
    it('input phone', function() {
        expect($(element).find('input[name="phone"]').length).toEqual(1);
    });
});