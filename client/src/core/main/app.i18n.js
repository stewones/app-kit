angular.module("app.i18n", []).config(["$translateProvider", function($translateProvider) {
$translateProvider.translations("en_US", {
    "WELCOME_WARN": "Hello {{firstName}}, welcome back!"
});

$translateProvider.translations("pt_BR", {
    "WELCOME_WARN": "Olá {{firstName}}, bem vind@ de volta!"
});
}]);
