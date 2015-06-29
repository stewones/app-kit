'use strict';
/**
 * @ngdoc service
 * @name page.module.factory:$page
 * @description 
 * Comportamentos e estados da página
 **/
angular.module('page.module').factory('$page', /*@ngInject*/ function($mdToast) {
    this._title = '';
    this._description = '';
    this._ogSiteName = '';
    this._ogTitle = '';
    this._ogDescription = '';
    this._ogUrl = '';
    this._ogImage = '';
    this._ogSection = '';
    this._ogTag = '';
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
     * @name page.module.factory:$page#title
     * @methodOf page.module.factory:$page
     * @description
     * Setar meta tag título
     * @param {string} str titulo    
     **/
    function title(value) {
        if (value) this._title = value;
        else return this._title;
    }
    /**
     * @ngdoc function
     * @name page.module.factory:$page#description
     * @methodOf page.module.factory:$page
     * @description
     * Setar meta tag descrição
     * @param {string} str titulo    
     **/
    function description(value) {
        if (value) this._description = value;
        else return this._description;
    }
    //
    // OPEN GRAPH
    //
    function ogLocale(value) {
        if (value) this._ogLocale = value;
        else return this._ogLocale;
    }

    function ogSiteName(value) {
        if (value) this._ogSiteName = value;
        else return this._ogSiteName;
    }

    function ogTitle(value) {
        if (value) this._ogTitle = value;
        else return this._ogTitle;
    }

    function ogDescription(value) {
        if (value) this._ogDescription = value;
        else return this._ogDescription;
    }

    function ogUrl(value) {
        if (value) this._ogUrl = value;
        else return this._ogUrl;
    }

    function ogImage(value) {
        if (value) this._ogImage = value;
        else return this._ogImage;
    }

    function ogSection(value) {
        if (value) this._ogSection = value;
        else return this._ogSection;
    }

    function ogTag(value) {
        if (value) this._ogTag = value;
        else return this._ogTag;
    }
    //
    // PAGE LOADER
    //
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
    //
    // PROGRESS (SPIN)
    //
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

    function toast(msg, time) {
        time = time ? time : 5000;
        $mdToast.show($mdToast.simple().content(msg).position('bottom right').hideDelay(time));
    }
})