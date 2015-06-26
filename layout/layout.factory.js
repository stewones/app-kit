'use strict';
angular.module('layout.module').factory('layout', /*@ngInject*/ function($mdToast) {
    this.title = '';
    this.description = '';
    this._ogLocale = '';
    this.ogSiteName = '';
    this.ogTitle = '';
    this.ogDescription = '';
    this.ogUrl = '';
    this.ogImage = '';
    this.ogSection = '';
    this.ogTag = '';

    return {
        load: load(),
        progress: progress(),
        setTitle: setTitle,
        setDescription: setDescription,
        getDescription: getDescription,
        banner: this.banner,
        toast: toast,
        ogLocale: ogLocale,
        ogSiteName: ogSiteName,
        ogTitle: ogTitle,
        ogDescription: ogDescription,
        ogUrl: ogUrl,
        ogImage: ogImage,
        ogSection: ogSection,
        ogTag: ogTag
    }
    //
    // SEO
    //
    function setTitle(str) {
        this.title = str;
    }

    function setDescription(str) {
        this.description = str;
    }

    function getDescription() {
        return this.description;
    }
    //
    // OPEN GRAPH
    //
    function ogLocale(value) {
        if (value)
            this._ogLocale = value;
        else
            return this._ogLocale;
    }

    function ogSiteName(value) {
        if (value)
            this._ogSiteName = value;
        else
            return this._ogSiteName;
    }

    function ogTitle(value) {
        if (value)
            this._ogTitle = value;
        else
            return this._ogTitle;
    }

    function ogDescription(value) {
        if (value)
            this._ogDescription = value;
        else
            return this._ogDescription;
    }

    function ogUrl(value) {
        if (value)
            this._ogUrl = value;
        else
            return this._ogUrl;
    }

    function ogImage(value) {
        if (value)
            this._ogImage = value;
        else
            return this._ogImage;
    }

    function ogSection(value) {
        if (value)
            this._ogSection = value;
        else
            return this._ogSection;
    }

    function ogTag(value) {
        if (value)
            this._ogTag = value;
        else
            return this._ogTag;
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