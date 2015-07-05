'use strict';
/**
 * @ngdoc overview
 * @name core.app
 * @description
 * Kit para criação de aplicações frontend com angular 1.x <br />
 * Serviços dos módulos com namespace "core" são identificados pelo prefixo $
 * Módulo central da aplicação para fácil injeção em módulos filhos
 **/
angular.module('core.app', [
    'app.setting',
    'app.env',
    'core.utils',
    'core.page',
    'core.login',
    'core.user',
    'core.profile',
    'core.account'
]);