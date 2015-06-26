'use strict';
angular.module('menu.module').provider('Menu', /*@ngInject*/ function MenuProvider() {
    this.mainMenu = [];
    this.toolbarMenu = [];
    this.$get = this.get = function() {
        return {
            main: this.mainMenu,
            toolbar: this.toolbarMenu
        }
    }
    this.set = function(menu) {
        this.mainMenu.push(menu);
    }
    this.setToolbar = function(menu) {
        this.toolbarMenu.push(menu);
    }
})