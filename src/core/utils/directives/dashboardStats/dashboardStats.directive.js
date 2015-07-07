'use strict';
angular.module('core.utils').directive('dashboardStats', /*@ngInject*/ function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            data: '=',
            url: '=',
            post: '='
        },
        templateUrl: 'app/utils/directives/dashboardStats/dashboardStats.tpl.html',
        link: function() {},
        controller: /*@ngInject*/ function($scope, $http) {
            bootstrap();
            $scope.update = update;
            $scope.$watch('post', function(nv, ov) {
                if (nv != ov) {
                    bootstrap();
                }
            }, true);

            function bootstrap() {
                $scope.loading = true;
                var onSuccess = function(response) {
                    $scope.loading = false;
                    for (var k in response.data) {
                        if (response.data.hasOwnProperty(k)) {
                            $scope.data.forEach(function(row, i) {
                                if (row.slug === k) {
                                    $scope.data[i].value = response.data[k];
                                }
                            })
                        }
                    }
                }
                var onFail = function(response) {
                    $scope.loading = false;
                    $scope.error = response && response.data ? response.data : 'erro no servidor';
                }
                $http.post($scope.url, $scope.post).then(onSuccess, onFail);
            }

            function update() {
                bootstrap();
            }
        }
    }
})