'use strict';
/**
 * @ngdoc service
 * @name core.account.factory:$account
 * @description 
 * Factory para injeção
 * @return {object} com metodos para setar e destruir a instância da factory
 **/
angular.module('core.account').factory('account', /*@ngInject*/ function() {
    /**
     * @ngdoc object
     * @name core.account.factory:$account#instance
     * @propertyOf core.account.factory:$account
     * @description 
     * Instância de conta armazenada pelo {@link core.account.service:$Account serviço}
     **/
    this.instance = {};
    return {
        /**
         * @ngdoc function
         * @name core.account.factory:$account#set
         * @methodOf core.account.factory:$account
         * @description 
         * Setar instância da conta
         * @example
         * <pre>
         * var account = new $Account();
         * $account.set(account);
         * //now account instance can be injectable
         * angular.module('myApp').controller('myCtrl',function($account){
         * console.log($account.instance) //imprime objeto de instância da conta
         * })
         * </pre>
         **/
        set: function(data) {
            this.instance = data;
            return data;
        },
        /**
         * @ngdoc function
         * @name core.account.factory:$account#destroy
         * @methodOf core.account.factory:$account
         * @description 
         * Apagar instância da conta
         * @example
         * <pre>
         * var account = new $Account();
         * $account.set(account);
         * //now user instance can be injectable
         * angular.module('myApp').controller('myCtrl',function($account){
         * $account.instance.destroy() //apaga instância da conta
         * })
         * </pre>
         **/
        destroy: function() {
            this.instance = {};
        }
    }
})