'use strict';
angular.module('menu.module').controller('MenuAvatarCtrl', /*@ngInject*/ function($rootScope, $scope) {
    var vm = this;
    vm.picture = '';
    if ($scope.gender === 'female') $scope.gender = 'f';
    if ($scope.gender === 'male') $scope.gender = 'm';
    vm.picture = '/assets/images/avatar-m.jpg';
    if ($scope.gender) vm.picture = '/assets/images/avatar-' + $scope.gender.toLowerCase() + '.jpg';
    if ($scope.facebook) vm.picture = 'https://graph.facebook.com/' + $scope.facebook + '/picture?width=150';
});