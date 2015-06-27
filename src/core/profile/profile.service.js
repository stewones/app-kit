'use strict';
angular.module('profile.module').service('Profile', /*@ngInject*/ function($http, string, layout, user, api, moment) {

    var Profile = function(params) {
        params = params ? params : {};
        if (typeof params === 'object') {
            for (var k in params) {
                if (params.hasOwnProperty(k)) {
                    this[k] = params[k];
                }
            }
        }
        this.id = params._id ? params._id : false;
        this.role = params.role ? params.role : [];

        this.active = params.active ? params.active : false;
        this.created = params.created ? params.created : moment().format();
        this.positions = params.role ? getWorkPosition(params.role) : [];

        // if (this.xp && this.xp.companies.length) {
        //     this.xp.companies.forEach(function(row, i) {
        //         if (row.start)
        //             this.xp.companies[i].start = moment(row.start, 'YYYY-MM-DD').format('DD/MM/YYYY');
        //         if (row.end)
        //             this.xp.companies[i].end = moment(row.end, 'YYYY-MM-DD').format('DD/MM/YYYY');
        //     }.bind(this))
        // }

        if (this.education && this.education.courses.length) {
            this.education.courses.forEach(function(row, i) {
                if (row.name)
                    this.education.courses[i].name = string(row.name).decodeHTMLEntities();
            }.bind(this))
        }

        // if (this.doc) {
        //     this.doc.birthday = params.doc && params.doc.birthday ? moment(params.doc.birthday.replace('T00:00:00.000Z', '')).format('DD/MM/YYYY') : '';
        // }



    }
    Profile.prototype.save = function(cbSuccess, cbError) {
        layout.load.init();
        if (this.busy) return;
        this.busy = true;
        var url = api.url + '/api/profiles';
        $http.put(url + '/' + this.id, this).success(function(response) {
            layout.load.done();
            this.busy = false;
            layout.toast('Seu perfil foi atualizado, ' + response.firstName + '.');
            if (cbSuccess)
                return cbSuccess(response);
        }.bind(this)).error(function(response) {
            layout.load.done();
            this.busy = false;
            layout.toast('Problema ao atualizar perfil');
            if (cbError)
                return cbError(response);
        }.bind(this));
    }

    function getWorkPosition() {
        var result = user.instance.getWorkPosition(user.instance.current('company')._id);
        return result.length ? result : [];
    }
    return Profile;
})