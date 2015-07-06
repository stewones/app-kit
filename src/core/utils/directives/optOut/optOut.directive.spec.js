'use strict';
/* global $ */
describe('<opt-out> component directive', function() {
    var $compile,
        $rootScope,
        element;
    beforeEach(module('loajrocks'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));
    it('needs to map attributes correctly', function() {
        element = $compile('<list-card image="http://cred-client.herokuapp.com/assets/images/event-1.jpg" title="Awesome Title" category="awesome category" date="19/06/2015" hour="16:20" address="Rua Des. Euripedez Queiroz do Valle, 652" address-city="Vitória" address-state="ES" action-label="Participar" action-location="/the-url-location-of-action"></list-card>')($rootScope);
        $rootScope.$digest();
        var expected = '';
        expected += '<img ng-src="http://cred-client.herokuapp.com/assets/images/event-1.jpg" src="http://cred-client.herokuapp.com/assets/images/event-1.jpg">';
        expected += '<h3 ng-bind="title" class="ng-binding">Awesome Title</h3>';
        expected += '<h4 ng-bind="subtitle" class="ng-binding"></h4>';
        expected += '<span ng-bind="date" class="ng-binding">19/06/2015</span>';
        expected += '<span ng-bind="hour" class="ng-binding">16:20</span>';
        expected += '<p ng-bind="address" class="ng-binding">Rua Des. Euripedez Queiroz do Valle, 652</p>';
        expected += '<button class="md-raised md-button md-default-theme" ng-transclude="" ng-click="callAction()" tabindex="0"><span class="ng-binding ng-scope">Participar</span></button>';
        var digested = $(element)
            //transform to html
            .html()
            //replace line breaks
            .replace(/\r?\n|\r/g, '')
            //replace identation
            .replace(/  +/g, '');
        expect(digested).toBe(expected);
    });
});