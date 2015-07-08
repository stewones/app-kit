(function() {
    'use strict';
    angular.module('app.seed').service('Event', /*@ngInject*/ function($http, $page, api) {
        /**
         * @ngdoc service
         * @name events.module.service:Event
         * @description 
         * Modulo de eventos
         * @param {object} params Propriedades da instância
         **/
        var Event = function(params) {
            //params to instantiate
            params = params ? params : {};
            params.id = params._id ? params._id : false;

            // new way
            angular.extend(this, params);

            // old way
            // if (typeof params === 'object') {
            //     for (var k in params) {
            //         if (params.hasOwnProperty(k)) {
            //             this[k] = params[k];
            //         }
            //     }
            // }

            // manual way
            // this.title = '';
            // this.desc = '';
            // this.startDate = '';
            // this.startTime = '';
            // this.endDate = '';
            // this.endTime = '';
            // this.address = {
            //     cep: '',
            //     street: '',
            //     number: '',
            //     comp: '',
            //     bairro: '',
            //     city: '',
            //     state: ''
            // }
        }

        Event.prototype.setEdit = setEdit;
        Event.prototype.save = save;
        Event.prototype.update = update;
        Event.prototype.create = create;
        Event.prototype.formStatus = formStatus;
        Event.prototype.isBusyOrMake = isBusyOrMake;


        function setEdit(id) {
            var result = !!id;
            return this.edit = result;
        }

        function save() {
            console.log(this.id);
            // Should create or update?
            //return this.edit ? update() : create(form);
        }

        function update() {
            // Are we busy?
            if (isBusyOrMake())
                return false;

            $page.load.init();
            console.log(proto);
            $http.put(api.url + '/api/events/' + this.id, {
                model: proto
            }).success(updateEventComplete).error(updateEventFailed);

            //handle unlink success
            function updateEventComplete(response) {
                $page.toast('Evento atualizado com sucesso!');
                $page.load.done();
                this.busy = false;
            }

            //handle unlink fail
            function updateEventFailed(response) {
                $page.toast(response.error ? response.error : 'não foi possível atualizar o evento');
                $page.load.done();
                this.busy = false;
            }
        }

        function create(form) {
            // Are we busy?
            if (isBusyOrMake())
                return false;

            $page.load.init();

            $http.post(api.url + '/api/events/', {
                model: this
            }).success(createEventComplete).error(createEventFailed);

            //handle unlink success
            function createEventComplete(response) {
                $page.toast('Evento criado com sucesso!');
                $page.load.done();
                this.busy = false;
            }

            //handle unlink fail
            function createEventFailed(response) {
                $page.toast(response.error ? response.error : 'não foi possível criar o evento');
                $page.load.done();
                this.busy = false;
            }

        }

        function formStatus(form) {
            return (this.busy || form.$invalid || !form.$dirty);
        }

        function isBusyOrMake() {
            if (this.busy)
                return true;

            this.busy = true;
            return false;
        }

        return Event;
    })
})();