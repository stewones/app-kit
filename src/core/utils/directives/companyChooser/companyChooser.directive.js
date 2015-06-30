'use strict';
angular.module('core.utils').directive('companyChooser', /*@ngInject*/ function() {
    return {
        scope: {
            companyid: '=',
            companies: '=',
            hideMe: '=',
            placeholder: '='
        },
        replace: true,
        restrict: 'EA',
        controller: 'CompanyChooserCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/companyChooser/companyChooser.tpl.html'
            // link: function($scope, $elem) {
            //     //acompanhando issue no github https://github.com/angular/material/issues/2114
            //     //quando o model é alterado, as vezes, ele adiciona "," repetindo o valor corrente. Ex: "Shopping Boulevard, Shopping Boulevard"
            //     // $scope.$watch('companyid', function() {
            //     //     var elem = $elem[0],
            //     //         random = randomString(10),
            //     //         timeout = [];
            //     //     //  timeout[random] = setInterval(function() {
            //     //     $scope.$apply(function() {
            //     //         var company = $(elem).find('md-select-label span').first().text();
            //     //         var split = company.split(',');
            //     //         $(elem).find('md-select-label span').first().text(split[0]);
            //     //            // $(elem).find('md-select').hide().show();
            //     //          clearInterval(timeout[random]);
            //     //     });
            //     //     //  }, 3000);
            //     // }, true);
            //     function randomString(length) {
            //         return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
            //     }
            // }
    }
});