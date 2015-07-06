'use strict';
angular.module('core.user').provider('$user',
    /**
     * @ngdoc object
     * @name core.user.$userProvider
     * @description
     * 2 em 1 - provém configurações e a factory (ver $get) com estados/comportamentos de usuário.
     **/
    /*@ngInject*/
    function $userProvider() {
        /**
         * @ngdoc object
         * @name core.user.$userProvider#_instance
         * @propertyOf core.user.$userProvider
         * @description 
         * Instância de usuário armazenada pelo {@link core.user.service:$User serviço}
         **/
        this._instance = {};
        /**
         * @ngdoc object
         * @name core.user.$userProvider#_setting
         * @propertyOf core.user.$userProvider
         * @description 
         * Armazena configurações
         **/
        this._setting = {};
        /**
         * @ngdoc function
         * @name core.user.$userProvider#$get
         * @propertyOf core.user.$userProvider
         * @description 
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($user) {     
         *      console.log($user.setting.roleForCompany);
         *      //printa a regra para empresa
         * })
         * </pre>
         * @return {object} objeto correspondente a uma Factory
         **/
        this.$get = this.get = function() {
            return {
                instance: function() {
                    return this._instance
                },
                setting: this._setting,
                /**
                 * @ngdoc function
                 * @name core.user.$userProvider#set
                 * @methodOf core.user.$userProvider
                 * @description 
                 * Setar instância do usuário
                 * @example
                 * <pre>
                 * var user = new $User();
                 * $user.set(user);
                 * //now user instance can be injectable
                 * angular.module('myApp').controller('myCtrl',function($user){
                 * console.log($user.instance()) //imprime objeto de instância do usuário
                 * })
                 * </pre>
                 **/
                set: function(data) {
                    this._instance = data;
                    return data;
                },
                /**
                 * @ngdoc function
                 * @name core.user.$userProvider#destroy
                 * @methodOf core.user.$userProvider
                 * @description 
                 * Apagar instância do usuário
                 * @example
                 * <pre>
                 * var user = new $User();
                 * $user.set(user);
                 * //now user instance can be injectable
                 * angular.module('myApp').controller('myCtrl',function($user){
                 * $user.instance().destroy() //apaga instância do usuário
                 * })
                 * </pre>
                 **/
                destroy: function() {
                    this._instance = {};
                }
            }
        }
        this.setting = function(key, val) {
            if (key && val) return this._setting[key] = val;
            else if (key) return this._setting[key];
            else return this._setting;
        }
    })