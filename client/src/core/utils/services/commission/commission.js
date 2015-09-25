'use strict';
var window = window ? window : {};
//
// @usage
// var commission = new Commission(options);
// - Extrair totais (liquido e taxa) a partir de um valor
// commission.resume(number)
// - Gerar total de comissão a partir de uma lista de produtos (ingressos)
// commission.resume(array)
//
var Commission = function(options) {
    var _ = window.lodash ? window.lodash : require('lodash');
    //
    // Planos
    // https://github.com/esgrupo/credenciando/issues/110
    //
    // Range = periodo de preços (x a y)
    // Percent = porcentagem a ser aplicada em cima do valor passado
    // Value = valor a ser aplicado em cima do valor passado
    // 
    this.plans = [{
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
    _.merge(this, options);
};
//
// API para resumo de comissão a partir de um valor passado
//
Commission.prototype.resume = resume;
Commission.prototype.sum = sum;

function resume(value) {
    var _ = window.lodash ? window.lodash : require('lodash');
    if (_.isArray(value)) {
        var fee = 0,
            total = 0;
        _.each(value, function(row) {
            var sum = this.sum(row.product.price);
            fee += sum.fee * row.qty;
            total += row.product.price * row.qty;
        }.bind(this));
        total -= fee;
        return {
            fee: fee.toFixed(2),
            liquid: total.toFixed(2)
        }
    } else if (_.isNumber(value)) {
        var sum = this.sum(value);
        return {
            fee: sum.fee,
            liquid: sum.liquid
        }
    }
}
//
// Calcula a soma pelo valor passado em relação aos planos
// e retorna um objeto com os totais de:
// - Comissão
// - Liquidez 
//
function sum(value) {
    var _ = window.lodash ? window.lodash : require('lodash');
    var fee = 0,
        liquid = value;
    _.each(this.plans, function(plan) {
        if (value >= plan.range.min && value <= plan.range.max) {
            if (plan.percent) fee += (value * plan.percent) / 100;
            if (plan.value) fee += plan.value;
        }
    });
    //
    // Subtrair comissão do total liquido
    //
    liquid -= fee;
    return {
        fee: fee.toFixed(2),
        liquid: liquid.toFixed(2)
    }
}
//
// Browser
//
if (window && window.length !== undefined) {
    angular.module('core.utils').service('Commission', /*@ngInject*/ function event(lodash) {
        window.lodash = lodash;
        return Commission;
    });
}
//
// Node
//
else {
    // var _ = require('lodash');
    module.exports = Commission;
}