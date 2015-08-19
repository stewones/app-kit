'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:imageCutter
 * @restrict EA
 * @description
 * Cortador de imagens praparado para trabalhar com backend
 * @element a
 * @param {string} endpointUrl endereço do server
 * @param {object} endpointParams parâmetros adicionais enviado ao server
 * @param {function} endpointSuccess callback para sucesso
 * @param {function} endpointFail callback para falha
 * @param {bool} cutOnModal utilizar em modo md-dialog
 * @param {string} cutOnModalTitle título do md-dialog
 * @param {integer} cutWidth tamanho do corte
 * @param {integer} cutHeight altura do corte
 * @param {string} cutShape formato do corte (circle|square)
 * @param {string} cutLabel nome do botão cortar
 * @param {var} cutResult resultado do corte (base64)
 * @param {var} cutStep passo atual do corte (1|2|3)
 **/

angular.module('core.utils').directive('imageCutter', /*@ngInject*/ function($mdDialog, $http, $rootScope) {
    return {
        scope: {
            endpointUrl: '@',
            endpointParams: '=',
            endpointSuccess: '=',
            endpointFail: '=',
            cutOnModal: '@',
            cutOnModalTitle: '@',
            cutWidth: '@',
            cutHeight: '@',
            cutShape: '@',
            cutLabel: '@',
            cutResult: '=',
            cutStep: '='
        },
        replace: true,
        transclude: true,
        restrict: 'EA',
        templateUrl: 'core/utils/directives/imageCutter/imageCutter.tpl.html',
        controller: 'ImageCutterAreaCtrl',
        link: function($scope, $elem) {
            $scope.modal = modal;
            $scope.hide = hide;
            $scope.$watch('cutStep', function(nv, ov) {
                if (nv != ov) {
                    /**
                     * Passo 3 - corte
                     */
                    if (nv === 3) {
                        /**
                         * Enviar para o server
                         */
                        if ($scope.cutOnModal)
                            $scope.send()
                    }
                }
            })

            function modal(ev) {
                //
                // reset
                //
                reboot();
                //
                // open dialog
                //
                $mdDialog.show({
                    templateUrl: 'core/utils/directives/imageCutter/modal.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    scope: $scope, // use parent scope in template
                    preserveScope: true
                });
            }

            function hide() {
                $mdDialog.hide();
            }

            function toggleOpacity() {
                $scope.$emit('ImageCutterToggleOpacity')
            }

            function toggleBusy() {
                $scope.$emit('ImageCutterToggleBusy')
            }

            function reboot() {
                $scope.$emit('ImageCutterReboot')
            }
        }
    }
});