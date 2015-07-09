'use strict';
angular.module('core.utils').directive('imageCutter', /*@ngInject*/ function() {
    return {
        scope: {
            endpoint: '=',
            cutWidth: '=',
            cutHeight: '=',
            cutShape: '=',
            cutLabel: '@',
            cutResult: '=',
            cutStep: '='
        },
        //require: ['^imageCrop', '^ngModel'],
        replace: true,
        restrict: 'EA',
        controller: 'ImageCutterCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/imageCutter/imageCutter.tpl.html',
        link: function($scope, $elem, $attr) {
            $scope.cutLabel = $scope.cutLabel ? $scope.cutLabel : 'Crop';
            $scope.$watch('cutStep', function(nv, ov) {
                if (nv != ov) {
                    if (nv === 2) {
                        //refresh button
                        // var refreshButton = '';
                        // refreshButton += '<button class="refresh md-raised md-accent" ng-click="cutResult=null;cutStep=1">';
                        // refreshButton += '<i class="fa fa-refresh"></i>';
                        // refreshButton += '<md-tooltip>';
                        // refreshButton += 'Recomeçar';
                        // refreshButton += '</md-tooltip>';
                        // refreshButton += '</button>';

                        //add material classes and icon to "crop" button
                        $($elem).find('button:contains("Crop")')
                            .addClass('md-raised md-primary md-button md-default-theme')
                            .html('<span><i class="fa fa-crop"></i> ' + $scope.cutLabel + '<span>')
                            //coloca o bottao de reset ao lado do bottao de crop
                            .parent().append($($elem).find('button.refresh'));

                        var interval = setInterval(function() {
                            $scope.$apply(function() {
                                clearInterval(interval);
                            })
                        }, 500);
                    }
                }
            })
        }
    }
});