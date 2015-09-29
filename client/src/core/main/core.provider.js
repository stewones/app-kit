'use strict';
angular.module('core.app').provider('$app',
    /**
     * @ngdoc object
     * @name app.kit.$appProvider
     * @description
     * Provém configurações para aplicação
     **/
    /*@ngInject*/
    function $appProvider($stateProvider) {
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_config
         * @propertyOf app.kit.$appProvider
         * @description 
         * armazena configurações
         **/
        this._config = {};
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_layoutUrl
         * @propertyOf app.kit.$appProvider
         * @description 
         * url do template para layout
         **/
        this._layoutUrl = 'core/page/layout/layout.tpl.html';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_toolbarUrl
         * @propertyOf app.kit.$appProvider
         * @description 
         * url do template para toolbar
         **/
        this._toolbarUrl = 'core/page/toolbar/toolbar.tpl.html';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_toolbarTitleUrl
         * @propertyOf app.kit.$appProvider
         * @description 
         * url do template para o toolbar title
         **/
        this._toolbarTitleUrl = 'core/page/toolbar/title/toolbarTitle.tpl.html';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_sidenavUrl
         * @propertyOf app.kit.$appProvider
         * @description 
         * url do template para sidenav
         **/
        this._sidenavUrl = 'core/page/menu/sidenav.tpl.html';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_logo
         * @propertyOf app.kit.$appProvider
         * @description 
         * armazena logo
         **/
        this._logo = '';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_logoWhite
         * @propertyOf app.kit.$appProvider
         * @description 
         * armazena logo na versão branca
         **/
        this._logoWhite = '';
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#$get
         * @propertyOf app.kit.$appProvider
         * @description 
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($app) {     
         *      console.log($app.layoutUrl);
         *      //prints the default layoutUrl
         *      //ex.: "core/page/layout/layout.tpl.html"     
         *      console.log($app.config('myOwnConfiguration'));
         *      //prints the current config
         *      //ex.: "{ configA: 54, configB: '=D' }"
         * })
         * </pre>
         * @return {object} Retorna um objeto contendo valores das propriedades.
         **/
        this.$get = this.get = /*@ngInject*/ function($window, $sessionStorage, $localStorage, setting) {
            return {
                config: this._config,
                layoutUrl: this._layoutUrl,
                toolbarUrl: this._toolbarUrl,
                toolbarTitleUrl: this._toolbarTitleUrl,
                sidenavUrl: this._sidenavUrl,
                logoWhite: this._logoWhite,
                logo: this._logo,
                /**
                 * @ngdoc method
                 * @name app.kit.$appProvider#storage
                 * @methodOf app.kit.$appProvider
                 * @description
                 * Carregar/persistir dados
                 * @param {string} type tipo da persistência (local/session)
                 * @return {object} getter/setter para persistência de dados
                 **/
                storage: function(type) {
                    var $storage;
                    if (type === 'local') {
                        if (!$localStorage.app) reset();
                        $storage = $localStorage.app;
                    } else {
                        if (!$sessionStorage.app) reset();
                        $storage = $sessionStorage.app;
                    }

                    function reset() {
                        if (type === 'local') {
                            $localStorage.app = {};
                        } else {
                            $sessionStorage.app = {};
                        }
                    }
                    return {
                        set: function(item) {
                            angular.extend($storage, item)
                            return $storage;
                        },
                        get: function() {
                            return $storage;
                        },
                        destroy: function() {
                            reset();
                        }
                    }
                }
            }
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#config
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para configurações
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {     
         *     $appProvider.config('myOwnConfiguration', {
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
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#logo
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para o path da logo
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {     
         *     $appProvider.logo('assets/images/my-logo.png')
         * })
         * </pre>
         * @param {string} value caminho para logomarca   
         **/
        this.logo = function(value) {
            if (value) return this._logo = value;
            else return this._logo;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#logoWhite
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para o path da logo na versão branca
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {     
         *     $appProvider.logoWhite('assets/images/my-logo.png')
         * })
         * </pre>
         * @param {string} value caminho para logomarca   
         **/
        this.logoWhite = function(value) {
            if (value) return this._logoWhite = value;
            else return this._logoWhite;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#layoutUrl
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para url do layout
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {     
         *      $appProvider.layoutUrl('app/layout/my-layout.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.layoutUrl = function(val) {
            if (val) return this._layoutUrl = val;
            else return this._layoutUrl;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#toolbarUrl
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para url do toolbar
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {     
         *      $appProvider.toolbarUrl('app/layout/my-toolbar.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.toolbarUrl = function(val) {
            if (val) return this._toolbarUrl = val;
            else return this._toolbarUrl;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#toolbarTitleUrl
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para url do componente toolbar-title
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {     
         *      $appProvider.toolbarUrl('app/layout/my-toolbar.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.toolbarTitleUrl = function(val) {
            if (val) return this._toolbarTitleUrl = val;
            else return this._toolbarTitleUrl;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#sidenavUrl
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para url do sidenav
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {     
         *      $appProvider.sidenavUrl('app/layout/my-sidenav.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.sidenavUrl = function(val) {
            if (val) return this._sidenavUrl = val;
            else return this._sidenavUrl;
        };
    });