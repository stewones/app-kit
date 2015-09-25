'use strict';
angular.module('core.profile').service('$Profile', /*@ngInject*/ function($http, string, $page, $user, api, moment) {
    /**
     * @ngdoc service
     * @name core.profile.$Profile
     * @description 
     * Comportamentos e estados de perfil do usuário
     * @param {object} params Propriedades da instância
     **/
    var Profile = function(params) {
            /**
             * @ngdoc object
             * @name core.profile.$Profile#params
             * @propertyOf core.profile.$Profile
             * @description 
             * Propriedades da instância
             **/
            params = params ? params : {};
            if (typeof params === 'object') {
                angular.extend(this, params);
            }
            /**
             * @ngdoc object
             * @name core.profile.$Profile#id
             * @propertyOf core.profile.$Profile
             * @description 
             * Id do perfil
             **/
            this.id = params._id ? params._id : false;
            /**
             * @ngdoc object
             * @name core.profile.$Profile#role
             * @propertyOf core.profile.$Profile
             * @description 
             * Regra de apresentação
             **/
            this.role = params.role ? params.role : [];
            /**
             * @ngdoc object
             * @name core.profile.$Profile#active
             * @propertyOf core.profile.$Profile
             * @description 
             * Status do perfil
             **/
            this.active = params.active ? params.active : false;
            /**
             * @ngdoc object
             * @name core.profile.$Profile#created
             * @propertyOf core.profile.$Profile
             * @description 
             * Data de criação
             **/
            this.created = params.created ? params.created : moment().format();
            /**
             * @ngdoc object
             * @name core.profile.$Profile#positions
             * @propertyOf core.profile.$Profile
             * @description 
             * Posições de trabalho (@todo migrar para aplicações filhas)
             **/
            this.positions = params.role ? getWorkPosition(params.role) : [];
        }
        /**
         * @ngdoc function
         * @name core.profile.$Profile:save
         * @methodOf core.profile.$Profile
         * @description
         * Salvar perfil
         * @param {function} cbSuccess callback de sucesso
         * @param {function} cbError callback de erro
         */
    Profile.prototype.save = function(cbSuccess, cbError) {
            $page.load.init();
            if (this.busy) return;
            this.busy = true;
            var url = api.url + '/api/profiles';
            $http.put(url + '/' + this.id, this).success(function(response) {
                $page.load.done();
                this.busy = false;
                $page.toast('Seu perfil foi atualizado, ' + response.firstName + '.');
                if (cbSuccess)
                    return cbSuccess(response);
            }.bind(this)).error(function(response) {
                $page.load.done();
                this.busy = false;
                $page.toast('Problema ao atualizar perfil');
                if (cbError)
                    return cbError(response);
            }.bind(this));
        }
        /**
         * @ngdoc function
         * @name core.profile.$Profile:getWorkPosition
         * @methodOf core.profile.$Profile
         * @description
         * Obter a lista de cargos (@todo migrar para aplicações filhas)
         * @return {array} lista de cargos desejados
         */
    function getWorkPosition() {
        var result = $user.instance().getWorkPosition($user.instance().current('company')._id);
        return result.length ? result : [];
    }
    return Profile;
})