'use strict';
angular.module('core.utils').directive('imageCutter', /*@ngInject*/ function($http, $rootScope, api) {
    return {
        scope: {
            endpointUrl: '=',
            endpointParams: '=',
            endpointSuccess: '=',
            endpointFail: '=',
            cutOnModal: '=',
            cutWidth: '=',
            cutHeight: '=',
            cutShape: '=',
            cutLabel: '@',
            cutResult: '=',
            cutStep: '='
        },
        replace: true,
        transclude: true,
        restrict: 'EA',
        controller: 'ImageCutterCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/imageCutter/imageCutter.tpl.html',
        link: function($scope, $elem, $attr) {
            $scope.cutLabel = $scope.cutLabel ? $scope.cutLabel : 'Crop';
            $scope.endpointParams = $scope.endpointParams ? $scope.endpointParams : {};
            $scope.reboot = reboot;
            $scope.modal = modal;
            $scope.$watch('cutStep', function(nv, ov) {
                if (nv != ov) {
                    /**
                     * Passo 2 - seleção da imagem
                     */
                    if (nv === 2) {
                        //add material classes and icon to "crop" button
                        $($elem).find('button:contains("Crop")')
                            .addClass('md-raised md-primary md-button md-default-theme')
                            .html('<span><i class="fa fa-crop"></i> ' + $scope.cutLabel + '<span>')
                            //coloca o bottao de reset ao lado do bottao de crop
                            .parent()
                            .append($($elem).find('button.refresh').removeAttr('ng-transclude'))
                            .parent()
                            .prepend($($elem).find('div.progress'));

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
                        if ($scope.endpointUrl) {
                            toggleBusy();
                            //colocando em um intervalo de tempo pra pegar corretamente o resultado do cut
                            var interval = setInterval(function() {
                                var params = {
                                        image: $scope.cutResult
                                    }
                                    //extendendo aos parametros da diretiva
                                angular.extend(params, $scope.endpointParams);
                                //send to server
                                $http
                                    .put($scope.endpointUrl, params)
                                    .success(function(response) {
                                        if (typeof $scope.endpointSuccess === 'function') $scope.endpointSuccess(response);
                                        toggleBusy();
                                    })
                                    .error(function(response) {
                                        if (typeof $scope.endpointFail === 'function') $scope.endpointFail(response);
                                        toggleBusy();
                                    })
                                    //limpando intervalo de tempo pra não gerar loop infinito
                                clearInterval(interval);
                            }, 1000);
                        }
                    }
                }
            })

            function toggleOpacity() {
                $($elem).find('img.image-crop-final').toggleClass('opacity-3');
            }

            function toggleBusy() {
                $scope.busy = !$scope.busy;
                if ($scope.busy === false) {
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

            function modal() {
                alert('UAU MOTHER FOCKER')
            }
        }
    }
});