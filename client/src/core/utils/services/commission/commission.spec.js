var assert = require("assert"),
    expect = require("expect.js");
var Commission = require("./Commission");
describe('Commission Lib', function() {
    var _plans = [{
        range: {
            min: 0,
            max: 50
        },
        percent: 0,
        value: 5
    }, {
        range: {
            min: 51,
            max: 500
        },
        percent: 10,
        value: 0
    }, {
        range: {
            min: 501,
            max: 99999
        },
        percent: 8,
        value: 10
    }];
    var _items = [{
        product: {
            price: 54.00
        },
        qty: 1
    }, {
        product: {
            price: 501.00
        },
        qty: 2
    }, {
        product: {
            price: 45.00
        },
        qty: 3
    }];
    var commission = new Commission({
        plans: _plans
    });
    describe('If i have plans in options', function() {
        it('It should be an array', function() {
            expect(commission.plans).to.be.an('array');
        });
        it('It should map to same members', function() {
            expect(commission.plans).to.eql(_plans);
        });
    });
    describe('Resume method', function() {
        it('Should return correct result data object when called with number', function() {
            expect(commission.resume(60)).to.eql({
                fee: 6.00,
                liquid: 54.00
            });
        });
        it('Should return correct result data object when called with array', function() {
            expect(commission.resume(_items)).to.eql({
                fee: 120.56,
                liquid: 1070.44
            });
        });
    });
});