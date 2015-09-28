angular.module("app.i18n", []).config(["$translateProvider", function($translateProvider) {
$translateProvider.translations("en_US", {
    "USER_WELCOME_WARN": "Hello {{firstName}}, welcome back!"
});

$translateProvider.translations("pt_BR", {
    "USER_WELCOME_WARN": "Olá {{firstName}}, bem vind@ de volta!"
});
}]);
