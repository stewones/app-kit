   'use strict';
   angular.module('app.kit').provider('$app',
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
            * @name app.kit.$appProvider#_sidenavUrl
            * @propertyOf app.kit.$appProvider
            * @description 
            * url do template para sidenav
            **/
           this._sidenavUrl = 'core/page/menu/sidenav.tpl.html';
           /**
            * @ngdoc function
            * @name app.kit.$appProvider#$get
            * @propertyOf app.kit.$appProvider
            * @description 
            * getter que vira factory pelo angular para se tornar injetável em toda aplicação
            * @example
            * <pre>
            * angular.module('myApp.module').controller('MyCtrl', function($layout) {     
            *      console.log($layout.layoutUrl);
            *      //prints the current layoutUrl
            *      //ex.: "core/page/layout/layout.tpl.html"     
            *      console.log($layout.config('myOwnConfiguration'));
            *      //prints the current config
            *      //ex.: "{ configA: 54, configB: '=D' }"
            * })
            * </pre>
            * @return {object} Retorna um objeto contendo valores das propriedades.
            **/
           this.$get = this.get = function() {
                   return {
                       config: this._config,
                       layoutUrl: this._layoutUrl,
                       toolbarUrl: this._toolbarUrl,
                       sidenavUrl: this._sidenavUrl
                   }
               }
               /**
                * @ngdoc function
                * @name app.kit.$appProvider#config
                * @methodOf app.kit.$appProvider
                * @description
                * setter para configurações
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
               }
               /**
                * @ngdoc function
                * @name app.kit.$appProvider#layoutUrl
                * @methodOf app.kit.$appProvider
                * @description
                * setter para url do layout
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
               }
               /**
                * @ngdoc function
                * @name app.kit.$appProvider#toolbarUrl
                * @methodOf app.kit.$appProvider
                * @description
                * setter para url do toolbar
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
               }
               /**
                * @ngdoc function
                * @name app.kit.$appProvider#sidenavUrl
                * @methodOf app.kit.$appProvider
                * @description
                * setter para url do sidenav
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
           }
       });