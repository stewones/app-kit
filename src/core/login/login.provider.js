'use strict';
angular.module('core.login').provider('$login',
    /**
     * @ngdoc object
     * @name core.login.$loginProvider
     **/
    /*@ngInject*/
    function $loginProvider() {
        /**
         * @ngdoc object
         * @name core.login.$loginProvider#_config
         * @propertyOf core.login.$loginProvider
         * @description 
         * armazena configurações
         **/
        this._config = {};
        /**
         * @ngdoc object
         * @name core.login.$loginProvider#_templateUrl
         * @propertyOf core.login.$loginProvider
         * @description 
         * url do template para a rota
         **/
        this._templateUrl = 'core/login/login.tpl.html';
        /**
         * @ngdoc object
         * @name core.login.$loginProvider#_signupTemplateUrl
         * @propertyOf core.login.$loginProvider
         * @description 
         * url do template para novos cadastros
         **/
        this._signupTemplateUrl = 'core/login/register/register.tpl.html';
        /**
         * @ngdoc function
         * @name core.login.$loginProvider#$get
         * @propertyOf core.login.$loginProvider
         * @description 
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($login) {     
         *      console.log($login.templateUrl);
         *      //prints the current templateUrl of `core.login`
         *      //ex.: "core/login/login.tpl.html"     
         *      console.log($login.config('myOwnConfiguration'));
         *      //prints the current config
         *      //ex.: "{ configA: 54, configB: '=D' }"
         * })
         * </pre>
         * @return {object} Retorna um objeto contendo valores das propriedades. ex: config e templateUrl
         **/
        this.$get = this.get = function() {
                return {
                    config: this._config,
                    templateUrl: this._templateUrl,
                    signupTemplateUrl: this._signupTemplateUrl
                }
            }
            /**
             * @ngdoc function
             * @name core.login.$loginProvider#config
             * @methodOf core.login.$loginProvider
             * @description
             * setter para configurações
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
             * @name core.login.$loginProvider#templateUrl
             * @methodOf core.login.$loginProvider
             * @description
             * setter para url do template
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
            /**
             * @ngdoc function
             * @name core.login.$loginProvider#signupTemplateUrl
             * @methodOf core.login.$loginProvider
             * @description
             * setter para url do template de novos cadastros
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($loginProvider) {     
             *      $loginProvider.signupTemplateUrl('app/login/my-signup.html')
             * })
             * </pre>
             * @param {string} val url do template
             **/
        this.signupTemplateUrl = function(val) {
            if (val) return this._signupTemplateUrl = val;
            else return this._signupTemplateUrl;
        }
    });