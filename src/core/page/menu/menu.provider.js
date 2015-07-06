'use strict';
angular.module('core.menu').provider('$menu',
    /**
     * @ngdoc object
     * @name core.menu.$menuProvider
     * @description
     * 2 em 1 - provém configurações e a factory (ver $get) com estados/comportamentos de menu.
     **/
    /*@ngInject*/
    function $menuProvider() {
        /**
         * @ngdoc object
         * @name core.menu.$menuProvider#mainMenu
         * @propertyOf core.menu.$menuProvider
         * @description 
         * Armazena o menu principal
         **/
        this.mainMenu = [];
        /**
         * @ngdoc object
         * @name core.menu.$menuProvider#toolbarMenu
         * @propertyOf core.menu.$menuProvider
         * @description 
         * Armazena o menu para a toolbar
         **/
        this.toolbarMenu = [];
        /**
         * @ngdoc function
         * @name core.menu.$menuProvider#$get
         * @propertyOf core.menu.$menuProvider
         * @description 
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($menu) {     
         *      console.log($menu.main); //printa array contendo itens do menu principal     
         *      $menu.api().close() //fecha o menu
         * })
         * </pre>
         * @return {object} Retorna um objeto correspondente a uma Factory
         **/
        this.$get = this.get = /*@ngInject*/ function($rootScope, $mdSidenav) {
                return {
                    main: this.mainMenu,
                    toolbar: this.toolbarMenu,
                    api: api($rootScope, $mdSidenav)
                }
            }
            /**
             * @ngdoc function
             * @name core.menu.$menuProvider#set
             * @methodOf core.menu.$menuProvider
             * @description
             * Adicionar um novo menu
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($menuProvider) {     
             *     $menuProvider.set({
             *         name: 'Conta',
             *         type: 'link',
             *         icon: 'fa fa-at',
             *         url: '/account/',
             *         state: 'app.account'
             *     });
             * })
             * </pre>
             * @param {object} menu objeto contendo as propriedades do menu   
             **/
        this.set = function(menu) {
                this.mainMenu.push(menu);
            }
            /**
             * @ngdoc function
             * @name core.menu.$menuProvider#setToolbar
             * @methodOf core.menu.$menuProvider
             * @description
             * Adicionar um novo menu no toolbar
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($menuProvider) {     
             *     $menuProvider.setToolbar({
             *         name: 'Conta',
             *         type: 'link',
             *         icon: 'fa fa-at',
             *         url: '/account/',
             *         state: 'app.account'
             *     });
             * })
             * </pre>
             * @param {object} menu objeto contendo as propriedades do menu   
             **/
        this.setToolbar = function(menu) {
                this.toolbarMenu.push(menu);
            }
            /**
             * @ngdoc function
             * @name core.menu.$menuProvider#api
             * @methodOf core.menu.$menuProvider
             * @example
             * <pre>
             * angular.module('myApp.module').controller('MyCtrl', function($menu) {       
             *      $menu.api().open() //abre o menu
             *      $menu.api().close() //fecha o menu
             * })
             * </pre>
             * @return {object} comportamentos do menu
             **/
        function api($rootScope, $mdSidenav) {
            return function api() {
                return {
                    openedSection: false,
                    currentPage: null,
                    open: function() {
                        $rootScope.$emit('AppMenuOpened');
                        $mdSidenav('left').open();
                    },
                    close: function() {
                        $rootScope.$emit('AppMenuClosed');
                        $mdSidenav('left').close();
                    },
                    //sections: sampleMenu(),
                    sections: this.mainMenu,
                    selectSection: function(section) {
                        this.openedSection = section;
                    },
                    toggleSelectSection: function(section) {
                        this.openedSection = (this.openedSection === section ? false : section);
                    },
                    isChildSectionSelected: function(section) {
                        return this.openedSection === section;
                    },
                    isSectionSelected: function(section) {
                        var selected = false;
                        var openedSection = this.openedSection;
                        if (openedSection === section) {
                            selected = true;
                        } else if (section.children) {
                            section.children.forEach(function(childSection) {
                                if (childSection === openedSection) {
                                    selected = true;
                                }
                            });
                        }
                        return selected;
                    },
                    selectPage: function(section, page) {
                        //page && page.url && $location.path(page.url);
                        this.currentSection = section;
                        this.currentPage = page;
                    },
                    isPageSelected: function(page) {
                        return this.currentPage === page;
                    },
                    isOpen: function(section) {
                        return this.isSectionSelected(section);
                    },
                    toggleOpen: function(section) {
                        return this.toggleSelectSection(section);
                    },
                    isSelected: function(page) {
                        return this.isPageSelected(page);
                    }
                }
            }
        }
        //
        // MENU SECTIONS SAMPLE
        //
        /*function sampleMenu() {
                return [
                    {
                    name: 'API Reference',
                    type: 'heading',
                    //iconSvg: 'ic_dashboard',
                    icon: 'fa fa-dashboard',
                    children: [{
                        name: 'Layout',
                        type: 'toggle',
                        pages: [{
                            name: 'Container Elements',
                            id: 'layoutContainers',
                            url: '/layout/container'
                        }, {
                            name: 'Grid System',
                            id: 'layoutGrid',
                            url: '/layout/grid'
                        }, {
                            name: 'Child Alignment',
                            id: 'layoutAlign',
                            url: '/layout/alignment'
                        }, {
                            name: 'Options',
                            id: 'layoutOptions',
                            url: '/layout/options'
                        }]
                    }, {
                        name: 'Services',
                        pages: [],
                        type: 'toggle'
                    }, {
                        name: 'Directives',
                        pages: [],
                        type: 'toggle'
                    }]
                }*/
        /*  {
                    name: 'Finalizar pedido',
                    url: '/checkout',
                    type: 'link'
                }, 
*/
        /*{
                        name: 'Produtos',
                        type: 'toggle',
                        icon: 'fa fa-diamond',
                        pages: [{
                            name: 'Pulseira A',
                            id: 'pulseira-a',
                            url: '/produtos/pulseira-a'
                        }, {
                            name: 'Pulseira B',
                            id: 'pulseira-b',
                            url: '/produtos/pulseira-b'
                        }, {
                            name: 'Pulseira C',
                            id: 'pulseira-c',
                            url: '/produtos/pulseira-c'
                        }]

                    }
                    ,
                    {
                        name: 'Políticas',
                        type: 'toggle',
                        icon: 'fa fa-file-text-o',
                        pages: [{
                            name: 'Termo de compromisso',
                            id: 'termo',
                            url: '/termo'
                        }, {
                            name: 'Política de privacidade',
                            id: 'privacidade',
                            url: '/privacidade'
                        }, ]
                    }, {
                        name: 'Sobre',
                        type: 'toggle',
                        icon: 'fa fa-briefcase',
                        pages: [{
                            name: 'Quem somos',
                            id: 'quemSomos',
                            url: '/quem-somos'
                        }]
                    }
                ];
            }*/
    })