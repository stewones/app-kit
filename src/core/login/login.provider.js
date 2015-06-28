'use strict';
angular.module('login.module').provider('$login',
    /**
     * @ngdoc object
     * @name login.module.$loginProvider
     * @description 
     * Configurações de Login
     **/
    /*@ngInject*/
    function $loginProvider() {
        /**
         * @ngdoc object
         * @name login.module.$loginProvider#config
         * @propertyOf login.module.$loginProvider
         * @description 
         * Armazenar configurações
         **/
        this.config = {};
        /**
         * @ngdoc object
         * @name login.module.$loginProvider#controller
         * @propertyOf login.module.$loginProvider
         * @description 
         * Contralador filho para rota de login
         **/
        this.controller = false;
        /**
         * @ngdoc object
         * @name login.module.$loginProvider#templateUrl
         * @propertyOf login.module.$loginProvider
         * @description 
         * Url do template para a rota
         **/
        this.templateUrl = 'core/login/login.tpl.html';
        /**
         * @ngdoc function
         * @name login.module.$loginProvider#$get
         * @propertyOf login.module.$loginProvider
         * @description 
         * Getter que vira factory pelo angular
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($login) {     
         *      console.log($login.templateUrl);
         *      //prints the current templateUrl of `login.module`
         *      //ex.: "core/login/login.tpl.html"     
         *      console.log($login.controller);
         *      //prints the current child controller of `login.module`
         *      //ex.: "$loginCtrl"
         * })
         * </pre>
         * @return {object} Retorna um objeto contendo valores das propriedades. ex: config e controller
         **/
        this.$get = this.get = function() {
                return {
                    config: this.config,
                    controller: this.controller,
                }
            }
            /**
             * @ngdoc function
             * @name login.module.$loginProvider#setConfig
             * @methodOf login.module.$loginProvider
             * @description
             * Setter para configurações
             * @example
             * <pre>
             * $loginProvider.setConfig('myOwnConfiguration', {
             *      configA: 54,
             *      configB: '=D'
             * })
             * </pre>
             * @param {string} key chave
             * @param {*} val valor   
             **/
        this.setConfig = function(key, val) {
                this.config[key] = val;
            }
            /**
             * @ngdoc function
             * @name login.module.$loginProvider#setController
             * @methodOf login.module.$loginProvider
             * @description
             * Setter de controlador filho para a rota de login
             * @example
             * <pre>
             * $loginProvider.setController('MyLoginCtrl')
             * </pre>
             * @param {string} val nome do controlador    
             **/
        this.setController = function(val) {
                this.controller = val;
            }
            /**
             * @ngdoc function
             * @name login.module.$loginProvider#setTemplateUrl
             * @methodOf login.module.$loginProvider
             * @description
             * Setter para url de template
             * @example
             * <pre>
             * $loginProvider.setTemplateUrl('app/login/my-login.html')
             * </pre>
             * @param {string} val url do template
             **/
        this.setTemplateUrl = function(val) {
            this.templateUrl = val;
        }
    });