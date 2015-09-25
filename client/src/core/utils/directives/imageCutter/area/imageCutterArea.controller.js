'use strict';
angular.module('core.utils').controller('ImageCutterAreaCtrl', /*@ngInject*/ function($scope, $http, $mdDialog) {
    $scope.send = function() {
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
                        if ($scope.cutOnModal) {
                            $mdDialog.hide();
                        }
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

    function toggleOpacity() {
        $scope.$emit('ImageCutterToggleOpacity')
    }

    function toggleBusy() {
        $scope.$emit('ImageCutterToggleBusy')
    }

    function reboot() {
        $scope.$emit('ImageCutterReboot')
    }

})