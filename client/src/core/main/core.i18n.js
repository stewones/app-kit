angular.module("core.i18n", []).config(["$translateProvider", function($translateProvider) {
$translateProvider.translations("en_US", {
    "USER_WELCOME_WARN": "Hello {{firstName}}, welcome back!",
    "USER_YOU_LEFT": "You just left."
});

$translateProvider.translations("pt_BR", {
    "USER_WELCOME_WARN": "Olá {{firstName}}, bem vind@ de volta!",
    "USER_YOU_LEFT": "Você saiu."
});
}]);
