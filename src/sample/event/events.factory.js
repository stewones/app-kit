'use strict';
angular.module('app.seed').factory('events', /*@ngInject*/ function events($http, $page, api, $user) {
    var _this = this;
    _this.instance = {};
    _this._busy = false;

    var categories = [{
        value: '',
        name: 'Selecione..'
    }, {
        value: 'conference',
        name: 'Conferências, Congressos e Convenções'
    }, {
        value: 'meeting',
        name: 'Encontros e Networking'
    }, {
        value: 'sports',
        name: 'Esportes'
    }, {
        value: 'corporate',
        name: 'Evento corporativo'
    }, {
        value: 'exhibition',
        name: 'Exposições, Mostras e Feiras'
    }, {
        value: 'religion',
        name: 'Religião'
    }, {
        value: 'seminar',
        name: 'Seminários, Palestras, Cursos e Workshops'
    }, {
        value: 'concert',
        name: 'Shows, Festas e Festivais'
    }, {
        value: 'arts',
        name: 'Teatro, Dança e Artes'
    }, {
        value: 'travel',
        name: 'Turismo'
    }];

    return {
        getEvents: getEvents,
        getEvent: getEvent,
        set: set,
        categories: categories,
        busy: busy
    }

    function set(data) {
        _this.instance = data;
        return data;
    }

    function busy(value) {
        if (value || value === false) return _this._busy = value;
        else return _this._busy;
    }

    function getEvents(totalPage, limit, filter) {
        $page.load.init();

        filter = filter ? JSON.stringify(filter) : false;

        return $http.get(api.url + '/api/events/', {
            params: {
                userId: $user.instance().id,
                skip: totalPage,
                limit: limit,
                filter: filter
            }
        }).then(getEventsComplete).catch(getEventsFailed);

        //handle unlink success
        function getEventsComplete(response) {
            $page.load.done();
            return response.data;
        }

        //handle unlink fail
        function getEventsFailed(response) {
            $page.toast(response.error ? response.error : 'não foi possível selecionar os eventos');
            $page.load.done();
        }
    }

    function getEvent(id) {
        // Are we busy?
        if (isBusyOrMake())
            return false;

        $page.load.init();

        return $http.get(api.url + '/api/events/' + id, {
                params: {
                    userId: $user.instance().id
                }
            })
            .then(getEventComplete).catch(getEventFailed);

        //handle unlink success
        function getEventComplete(response) {
            busy(false);
            $page.load.done();

            return response.data;
        }

        //handle unlink fail
        function getEventFailed(response) {
            $page.toast(response.error ? response.error : 'não foi possível selecionar o evento');
            $page.load.done();
            busy(false);
        }
    }

    function isBusyOrMake() {        
        if (busy())
            return true;

        busy(true);
        return false;
    }
});