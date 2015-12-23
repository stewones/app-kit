'use strict';
angular.module('core.utils').directive('imageCutterArea', /*@ngInject*/ function($http, $compile, $rootScope, $mdDialog) {
    return {
        scope: {
            endpointUrl: '@',
            endpointParams: '=',
            endpointSuccess: '=',
            endpointFail: '=',
            cutOnModal: '@',
            cutWidth: '@',
            cutHeight: '@',
            cutShape: '@',
            cutLabel: '@',
            cutResult: '=',
            cutStep: '='
        },
        replace: true,
        //transclude: true,
        restrict: 'EA',
        controller: 'ImageCutterAreaCtrl',
        // controllerAs: 'vm',
        templateUrl: 'core/utils/directives/imageCutter/area/imageCutterArea.tpl.html',
        link: function($scope, $elem, $attr) {
            $scope.cutLabel = $scope.cutLabel ? $scope.cutLabel : 'Crop';
            $scope.endpointParams = $scope.endpointParams ? $scope.endpointParams : {};
            $scope.reboot = reboot;
            $scope.$watch('cutStep', function(nv, ov) {
                if (nv != ov) {
                    /**
                     * Passo 2 - seleção da imagem
                     */
                    if (nv === 2) {
                        //add material classes and icon to "crop" button
                        $($elem).find('button:contains("Crop")').addClass('md-raised md-primary md-button').html('<span><i class="fa fa-crop"></i> ' + $scope.cutLabel + '<span>')
                            //coloca o bottao de reset ao lado do bottao de crop
                            .parent().append($($elem).find('button.refresh').removeAttr('ng-transclude')).parent().prepend($($elem).find('div.progress'));
                        // var interval = setInterval(function() {
                        //     $scope.$apply(function() {
                        //         clearInterval(interval);
                        //     })
                        // }, 500);
                    }
                    /**
                     * Passo 3 - corte
                     */
                    if (nv === 3) {
                        /**
                         * Enviar para o server
                         */
                        if (!$scope.cutOnModal || $scope.cutOnModal == 'false') $scope.send();
                    }
                }
            })
            $rootScope.$on('ImageCutterToggleOpacity', function() {
                toggleOpacity();
            })
            $rootScope.$on('ImageCutterReboot', function() {
                reboot();
            })
            $rootScope.$on('ImageCutterToggleBusy', function() {
                toggleBusy();
            })

            function toggleOpacity() {
                $($elem).find('img.image-crop-final').toggleClass('opacity-3');
            }

            function toggleBusy() {
                $scope.busy = !$scope.busy;
                if ($scope.busy === false) {
                    //$compile($elem)($scope)
                    //re-reboot directive
                    reboot();
                }
                toggleOpacity();
            }

            function reboot() {
                $scope.cutResult = null;
                $scope.cutStep = 1;
                $($elem).find('input.image-crop-input').val('');
                $rootScope.$emit('CropReset');
            }
        }
    }
});