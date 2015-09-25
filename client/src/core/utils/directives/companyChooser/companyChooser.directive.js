'use strict';
angular.module('core.utils').directive('companyChooser', /*@ngInject*/ function() {
    return {
        scope: {
            companyid: '=',
            companies: '=',
            hideMe: '=',
            placeholder: '=',
            showAllOption: '=' //mostrar opção "todas empresas"
        },
        replace: true,
        restrict: 'EA',
        controller: 'CompanyChooserCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/companyChooser/companyChooser.tpl.html'
    }
});