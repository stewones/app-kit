'use strict';
/* jshint undef: false, unused: false */
angular.module('app.utils').directive('onScrollApplyOpacity', /*@ngInject*/ function() {
    //
    // Essa diretiva é um hack pra resolver um bug de scroll nos botões de ação que contem wrapper com margin-top negativa
    //
    return {
        link: function(scope, elem) {
            elem.bind('scroll', function() {
                var element = angular.element(document.getElementsByClassName('content-action-wrapper')[0]);
                element.addClass('opacity-9');
                var timeout = setInterval(function() {
                    element.removeClass('opacity-9');
                    clearInterval(timeout);
                }, 1000);
            })
        }
    }
})