'use strict';
angular.module('login.module').provider('$login',
    /**
     * @ngdoc object
     * @name login.module.$loginProvider
     **/
    /*@ngInject*/
    function $loginProvider() {
        /**
         * @ngdoc object
         * @name login.module.$loginProvider#_config
         * @propertyOf login.module.$loginProvider
         * @description 
         * Armazena as configurações
         **/
        this._config = {};
        /**
         * @ngdoc object
         * @name login.module.$loginProvider#_templateUrl
         * @propertyOf login.module.$loginProvider
         * @description 
         * Url do template para a rota
         **/
        this._templateUrl = 'core/login/login.tpl.html';
        /**
         * @ngdoc function
         * @name login.module.$loginProvider#$get
         * @propertyOf login.module.$loginProvider
         * @description 
         * Getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($login) {     
         *      console.log($login.templateUrl);
         *      //prints the current templateUrl of `login.module`
         *      //ex.: "core/login/login.tpl.html"     
         *      console.log($login.config('myOwnConfiguration'));
         *      //prints the current config
         *      //ex.: "{ configA: 54, configB: '=D' }"
         * })
         * </pre>
         * @return {object} Retorna um objeto contendo valores das propriedades. ex: config e controller
         **/
        this.$get = this.get = function() {
                return {
                    config: this._config,
                    templateUrl: this._templateUrl
                }
            }
            /**
             * @ngdoc function
             * @name login.module.$loginProvider#config
             * @methodOf login.module.$loginProvider
             * @description
             * getter/setter para configurações
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($loginProvider) {     
             *     $loginProvider.config('myOwnConfiguration', {
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
             * @name login.module.$loginProvider#templateUrl
             * @methodOf login.module.$loginProvider
             * @description
             * getter/setter para url de template
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($loginProvider) {     
             *      $loginProvider.templateUrl('app/login/my-login.html')
             * })
             * </pre>
             * @param {string} val url do template
             **/
        this.templateUrl = function(val) {
            if (val) return this._templateUrl = val;
            else return this._templateUrl;
        }
    });