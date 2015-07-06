'use strict';
angular.module('core.account').provider('$account',
    /**
     * @ngdoc object
     * @name core.account.$accountProvider
     * @description
     * 2 em 1 - provém configurações e a factory (ver $get) com estados/comportamentos de conta.
     **/
    /*@ngInject*/
    function $accountProvider() {
        /**
         * @ngdoc object
         * @name core.account.$accountProvider#_instance
         * @propertyOf core.account.$accountProvider
         * @description 
         * Instância de conta armazenada pelo {@link core.account.service:$Account serviço}
         **/
        this._instance = {};
        /**
         * @ngdoc object
         * @name core.account.$accountProvider#_config
         * @propertyOf core.account.$accountProvider
         * @description 
         * armazena configurações
         **/
        this._config = {};
        /**
         * @ngdoc object
         * @name core.account.$accountProvider#_templateUrl
         * @propertyOf core.account.$accountProvider
         * @description 
         * url do template para a rota
         **/
        this._templateUrl = 'core/account/account.tpl.html';
        /**
         * @ngdoc function
         * @name core.account.$accountProvider#$get
         * @propertyOf core.account.$accountProvider
         * @description 
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($account) {     
         *      console.log($account.templateUrl);
         *      //prints the current templateUrl
         *      //ex.: "core/account/account.tpl.html"     
         *      console.log($account.config('myOwnConfiguration'));
         *      //prints the current config
         *      //ex.: "{ configA: 54, configB: '=D' }"
         * })
         * </pre>
         * @return {object} Retorna um objeto correspondente a uma Factory
         **/
        this.$get = this.get = function() {
                return {
                    config: this._config,
                    templateUrl: this._templateUrl,
                    /**
                     * @ngdoc function
                     * @name core.account.$accountProvider#set
                     * @methodOf core.account.$accountProvider
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
                        this._instance = data;
                        return data;
                    },
                    instance: function() {
                        return this._instance
                    },
                    /**
                     * @ngdoc function
                     * @name core.account.$accountProvider#destroy
                     * @methodOf core.account.$accountProvider
                     * @description 
                     * Apagar instância da conta
                     * @example
                     * <pre>
                     * var account = new $Account();
                     * $account.set(account);
                     * //now account instance can be injectable
                     * angular.module('myApp').controller('myCtrl',function($account){
                     * $account.instance.destroy() //apaga instância da conta
                     * })
                     * </pre>
                     **/
                    destroy: function() {
                        this.instance = {};
                    }
                }
            }
            /**
             * @ngdoc function
             * @name core.account.$accountProvider#config
             * @methodOf core.account.$accountProvider
             * @description
             * getter/setter para configurações
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($accountProvider) {     
             *     $accountProvider.config('myOwnConfiguration', {
             *          configA: 54,
             *          configB: '=D'
             *      })
             * })
             * </pre>
             * @param {string} key chave
             * @param {*} val valor   
             **/
        this.config = function(key, val) {
                if (val) return this._config[key] = val;
                else return this._config[key];
            }
            /**
             * @ngdoc function
             * @name core.account.$accountProvider#templateUrl
             * @methodOf core.account.$accountProvider
             * @description
             * getter/setter para url do template
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($accountProvider) {     
             *      $accountProvider.templateUrl('app/account/my-account.html')
             * })
             * </pre>
             * @param {string} val url do template
             **/
        this.templateUrl = function(val) {
            if (val) return this._templateUrl = val;
            else return this._templateUrl;
        }
    });