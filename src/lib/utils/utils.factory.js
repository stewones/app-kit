'use strict';
/* jshint undef: false, unused: false, shadow:true, quotmark: false, -W110,-W117, eqeqeq: false */
angular.module('app.utils').factory('utils', /*@ngInject*/ function($q) {
    var vm = this;
    return {
        isImg: isImg,      
        brStates: brStates,
        age: age
    }

    function isImg(src) {
        var deferred = $q.defer();
        var image = new Image();
        image.onerror = function() {
            deferred.resolve(false);
        };
        image.onload = function() {
            deferred.resolve(true);
        };
        image.src = src;
        return deferred.promise;
    }

    function age(date) {
        return moment(date).fromNow(true);
    }

    function brStates() {
        return [{
            value: "AC",
            name: "Acre"
        }, {
            value: "AL",
            name: "Alagoas"
        }, {
            value: "AM",
            name: "Amazonas"
        }, {
            value: "AP",
            name: "Amapá"
        }, {
            value: "BA",
            name: "Bahia"
        }, {
            value: "CE",
            name: "Ceará"
        }, {
            value: "DF",
            name: "Distrito Federal"
        }, {
            value: "ES",
            name: "Espírito Santo"
        }, {
            value: "GO",
            name: "Goiás"
        }, {
            value: "MA",
            name: "Maranhão"
        }, {
            value: "MT",
            name: "Mato Grosso"
        }, {
            value: "MS",
            name: "Mato Grosso do Sul"
        }, {
            value: "MG",
            name: "Minas Gerais"
        }, {
            value: "PA",
            name: "Pará"
        }, {
            value: "PB",
            name: "Paraíba"
        }, {
            value: "PR",
            name: "Paraná"
        }, {
            value: "PE",
            name: "Pernambuco"
        }, {
            value: "PI",
            name: "Piauí"
        }, {
            value: "RJ",
            name: "Rio de Janeiro"
        }, {
            value: "RN",
            name: "Rio Grande do Norte"
        }, {
            value: "RO",
            name: "Rondônia"
        }, {
            value: "RS",
            name: "Rio Grande do Sul"
        }, {
            value: "RR",
            name: "Roraima"
        }, {
            value: "SC",
            name: "Santa Catarina"
        }, {
            value: "SE",
            name: "Sergipe"
        }, {
            value: "SP",
            name: "São Paulo"
        }, {
            value: "TO",
            name: "Tocantins"
        }];
    }
})