(function() {
    'use strict';
    angular.module('core.list').service('$List', service);

    /*@ngInject*/
    function service($http, $page, api, $utils, $state, $stateParams) {

        /**
         * @ngdoc service
         * @name core.list.service:$List
         * @description
         * List with filters and next page button
         * @example
         * <pre>
         * // Place this on your controller, where you're injected the List service
         * // Instantiate a new object with scope, getFromSource and route/state name
         * var list = new $List({
         *     scope: $scope,
         *     route: 'app.home',
         *     getFromSource: function(totalPage, limit, filter){
         *         return $http.get(api.url + '/api/events/', {
         *             params: {
         *                 skip: totalPage,
         *                 limit: limit,
         *                 filter: filter
         *             }
         *         }).then(success).catch(fail);
         *     }
         * });
         *
         * // Make the first request to populate the list
         * // This will return a promise, so you can use get().then(success).catch(fail)
         * list.get();
         *
         * </pre>
         * @param {object} params Propriedades da instância
         **/
        var List = function(params) {
            var self = this;

            // Params to instantiate
            params = params ? params : {};

            ////////////////
            // Properties //
            ////////////////

            /**
             * @ngdoc object
             * @name core.list.service:$List#scope
             * @propertyOf core.list.service:$List
             * @description
             * Parent controller scope
             **/
            self.scope = false;

            /**
             * @ngdoc function
             * @name core.list.service:$List#getFromSource
             * @propertyOf core.list.service:$List
             * @description
             * Method to handle http call, must return a promise
             **/
            self.getFromSource = false;

            /**
             * @ngdoc string
             * @name core.list.service:$List#route
             * @propertyOf core.list.service:$List
             * @description
             * Route/state to append query params
             **/
            self.route = 'app.home';

            /**
             * @ngdoc function
             * @name core.list.service:$List#states
             * @propertyOf core.list.service:$List
             * @description
             * Output BR states for possible state filter
             **/
            self.states = $utils.brStates();

            /**
             * @ngdoc array
             * @name core.list.service:$List#entries
             * @propertyOf core.list.service:$List
             * @description
             * Entries array
             **/
            self.entries = [];

            /**
             * @ngdoc number
             * @name core.list.service:$List#total
             * @propertyOf core.list.service:$List
             * @description
             * Total entries
             **/
            self.total = 0;

            /**
             * @ngdoc number
             * @name core.list.service:$List#totalPage
             * @propertyOf core.list.service:$List
             * @description
             * Total entries displayed on the page, this will the skip prop on the server
             **/
            self.totalPage = $stateParams.page ? Number($stateParams.page) : 0;

            /**
             * @ngdoc number
             * @name core.list.service:$List#limit
             * @propertyOf core.list.service:$List
             * @description
             * Number of entries per page
             **/
            self.limit = 8;

            /**
             * @ngdoc boolean
             * @name core.list.service:$List#hasNextButton
             * @propertyOf core.list.service:$List
             * @description
             * State to display/hide next button
             **/
            self.hasNextButton = false;

            /**
             * @ngdoc object
             * @name core.list.service:$List#filter
             * @propertyOf core.list.service:$List
             * @description
             * Filter object
             **/
            self.filter = {};

            /**
             * @ngdoc boolean
             * @name core.list.service:$List#disableTransition
             * @propertyOf core.list.service:$List
             * @description
             * Filter object
             **/
            self.disableTransition = false;

            ///////////////////////
            // Extend properties //
            ///////////////////////

            // Extend class with custom params
            angular.extend(self, params);

            // Extend filters with $stateParams
            angular.extend(self.filter, $stateParams);

            // Watch for changes in the filter
            if (self.scope) self.scope.$watch('vm.list.filter', filterWatch, true);

            /////////////
            // Methods //
            /////////////

            // Public
            self.get = get;
            self.search = search;

            /**
             * @ngdoc function
             * @name core.list.service:$List:get
             * @methodOf core.list.service:$List
             * @description
             * Update route/state query params, get from the source
             * @example
             * <pre>
             * var list = new $List();
             * list.get();
             * </pre>
             */
            function get() {
                // Update query params, silent redirect(no refresh) / required config on state: 'reloadOnSearch : false'
                if (!self.disableTransition)
                    $location.search(updateQueryParams());

                // Change url
                return self.getFromSource(self.totalPage, self.limit, self.filter).then(getSuccess);
            }

            /**
             * @ngdoc function
             * @name core.list.service:$List:getSuccess
             * @methodOf core.list.service:$List
             * @description
             * Handle get() successful return, concat entries, update totals and update next button state
             */
            function getSuccess(data) {
                // Push new result
                self.entries = self.entries.concat(data.entries);

                // Update totals
                updateTotals(data.total, data.totalPage);

                // Update next button
                updateNextButton();

                // Return event
                return self.entries;
            }

            /**
             * @ngdoc function
             * @name core.list.service:$List:search
             * @methodOf core.list.service:$List
             * @description
             * Transition to search route with the term specified
             * @example
             * <pre>
             * var list = new $List();
             * list.search();
             * </pre>
             */
            function search() {
                // Reset main props
                resetList();

                // Update query params, silent redirect(no refresh)
                $state.go(self.route, updateQueryParams());
            }

            /**
             * @ngdoc function
             * @name core.list.service:$List:updateTotals
             * @methodOf core.list.service:$List
             * @description
             * Update total entries and total on the page
             */
            function updateTotals(total, totalPage) {
                self.total = total;
                self.totalPage += totalPage;
            }

            /**
             * @ngdoc function
             * @name core.list.service:$List:updateNextButton
             * @methodOf core.list.service:$List
             * @description
             * Update next button state
             */
            function updateNextButton() {
                var result = (self.total > self.totalPage);

                self.hasNextButton = result;
                return result;
            }

            /**
             * @ngdoc function
             * @name core.list.service:$List:updateQueryParams
             * @methodOf core.list.service:$List
             * @description
             * Update url query params according to filters
             */
            function updateQueryParams() {
                var obj = {};

                // Add current filters
                angular.extend(obj, self.filter);

                // Then add page entries number
                angular.extend(obj, {
                    page: self.totalPage
                });

                return obj;
            }

            /**
             * @ngdoc function
             * @name core.list.service:$List:filterChanged
             * @methodOf core.list.service:$List
             * @description
             * Handle change on the filter object, reset main props(entries, total, totalPage and hasNextButton) and do call get()
             */
            function filterChanged() {
                // Reset props
                resetList();

                // Get entries
                get();
            }

            /**
             * @ngdoc function
             * @name core.list.service:$List:updateQueryParams
             * @methodOf core.list.service:$List
             * @description
             * Filter watch action
             */
            function filterWatch(nv, ov) {
                if (nv != ov) {
                    filterChanged();
                }
            }

            /**
             * @ngdoc function
             * @name core.list.service:$List:resetList
             * @methodOf core.list.service:$List
             * @description
             * Reset main properties of the list
             */
            function resetList() {
                // Reset props
                self.entries = [];
                self.total = 0;
                self.totalPage = 0;
                self.hasNextButton = false;
            }
        }

        return List;
    }

})();