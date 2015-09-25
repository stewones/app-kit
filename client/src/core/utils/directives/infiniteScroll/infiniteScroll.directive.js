'use strict';
angular.module('core.utils').directive('infiniteScroll', /*@ngInject*/ function infiniteScroll() {
    return {
        restrict: "EA",
        link: function infiniteScrollLink($scope, $element) {
            var e = $element[0];
            $element.bind('scroll', function() {
                if (e.scrollTop + e.offsetHeight >= e.scrollHeight - 10) {
                    $scope.$emit('ScreenBottomReached');
                }
            })
        }
    }
})