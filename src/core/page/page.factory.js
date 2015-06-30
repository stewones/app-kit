'use strict';
/**
 * @ngdoc service
 * @name core.page.factory:$page
 * @description 
 * Comportamentos e estados da página
 **/
angular.module('core.page').factory('$page', /*@ngInject*/ function($mdToast) {
    this._title = '';
    this._description = '';
    this._ogSiteName = '';
    this._ogTitle = '';
    this._ogDescription = '';
    this._ogUrl = '';
    this._ogImage = '';
    this._ogSection = '';
    this._ogTag = '';
    this._logo = '';
    this._logoWhite = '';
    return {
        load: load(),
        progress: progress(),
        toast: toast,
        title: title,
        description: description,
        ogLocale: ogLocale,
        ogSiteName: ogSiteName,
        ogTitle: ogTitle,
        ogDescription: ogDescription,
        ogUrl: ogUrl,
        ogImage: ogImage,
        ogSection: ogSection,
        ogTag: ogTag
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#title
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para meta tag título
     * @param {string} str título da página
     * @return {string} título da página
     **/
    function title(value) {
        if (value) return this._title = value;
        else return this._title;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#description
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para meta tag descrição
     * @param {string} value descrição da página    
     **/
    function description(value) {
        if (value) return this._description = value;
        else return this._description;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#logo
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para logo
     * @param {string} value caminho para logomarca    
     **/
    function logo(value) {
        if (value) return this._logo = value;
        else return this._logo;
    }

    /**
     * @ngdoc function
     * @name core.page.factory:$page#logoWhite
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para logo na versão branca com fundo transparente
     * @param {string} value caminho para logomarca    
     **/
    function logoWhite(value) {
        if (value) return this._logoWhite = value;
        else return this._logoWhite;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogLocale
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para open-graph locale
     * @param {string} value locale    
     **/
    function ogLocale(value) {
        if (value) return this._ogLocale = value;
        else return this._ogLocale;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogSiteName
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para open-graph site name
     * @param {string} value site name    
     **/
    function ogSiteName(value) {
        if (value) return this._ogSiteName = value;
        else return this._ogSiteName;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogTitle
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para open-graph title
     * @param {string} value title    
     **/
    function ogTitle(value) {
        if (value) return this._ogTitle = value;
        else return this._ogTitle;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogDescription
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para open-graph description
     * @param {string} value description    
     **/
    function ogDescription(value) {
        if (value) return this._ogDescription = value;
        else return this._ogDescription;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogUrl
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para open-graph url
     * @param {string} value url    
     **/
    function ogUrl(value) {
        if (value) return this._ogUrl = value;
        else return this._ogUrl;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogImage
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para open-graph image
     * @param {string} value image    
     **/
    function ogImage(value) {
        if (value) return this._ogImage = value;
        else return this._ogImage;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogSection
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para open-graph section
     * @param {string} value section    
     **/
    function ogSection(value) {
        if (value) return this._ogSection = value;
        else return this._ogSection;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogTag
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para open-graph tag
     * @param {string} value tag    
     **/
    function ogTag(value) {
        if (value) return this._ogTag = value;
        else return this._ogTag;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#load
     * @methodOf core.page.factory:$page
     * @description
     * inicia e termina o carregamento da página
     * @return {object} com metodos de inicialização (init) e finalização (done)
     **/
    function load() {
        return {
            init: function() {
                this.status = true;
                //console.log('loader iniciado...' + this.status);
            },
            done: function() {
                this.status = false;
                //console.log('loader finalizado...' + this.status);
            }
        }
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#toast
     * @methodOf core.page.factory:$page
     * @description
     * mostra uma mensagem de aviso
     * @param {string} msg mensagem
     * @param {integer} time tempo em milisegundos
     **/
    function toast(msg, time) {
        time = time ? time : 5000;
        $mdToast.show($mdToast.simple().content(msg).position('bottom right').hideDelay(time));
    }
    //another type of load
    function progress() {
        return {
            init: function() {
                this.status = true;
                //console.log('progress iniciado...' + this.status);
            },
            done: function() {
                this.status = false;
                //console.log('progress finalizado...' + this.status);
            }
        }
    }
})