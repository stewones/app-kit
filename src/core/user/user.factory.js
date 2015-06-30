'use strict';
/**
 * @ngdoc service
 * @name core.user.factory:$user
 * @description 
 * Factory para injeção
 * @return {object} com metodos para setar e destruir a instância da factory
 **/
angular.module('core.user').factory('$user',
    /*@ngInject*/
    function() {
        /**
         * @ngdoc object
         * @name core.user.factory:$user#instance
         * @propertyOf core.user.factory:$user
         * @description 
         * Instância de usuário armazenada pelo {@link core.user.service:$User serviço}
         **/
        this.instance = {};

        return {
            /**
             * @ngdoc function
             * @name core.user.factory:$user#set
             * @methodOf core.user.factory:$user
             * @description 
             * Setar instância do usuário
             * @example
             * <pre>
             * var user = new $User();
             * $user.set(user);
             * //now user instance can be injectable
             * angular.module('myApp').controller('myCtrl',function($user){
             * console.log($user.instance) //imprime objeto de instância do usuário
             * })
             * </pre>
             **/
            set: function(data) {
                this.instance = data;
                return data;
            },
            /**
             * @ngdoc function
             * @name core.user.factory:$user#destroy
             * @methodOf core.user.factory:$user
             * @description 
             * Apagar instância do usuário
             * @example
             * <pre>
             * var user = new $User();
             * $user.set(user);
             * //now user instance can be injectable
             * angular.module('myApp').controller('myCtrl',function($user){
             * $user.instance.destroy() //apaga instância do usuário
             * })
             * </pre>
             **/
            destroy: function() {
                this.instance = {};
            }
        }
    })