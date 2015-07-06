// 'use strict';
// angular.module('core.account').controller('$AccountCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $mdDialog, $q, $timeout, $Account, $account, $User, $utils, $page, $user, setting, api) {
//     var vm = this;
//     //
//     // SEO
//     //
//     $page.title(setting.title);
//     $page.description(setting.description);
//     //
//     // Events
//     //
//     $rootScope.$on('CompanyIdUpdated', function() {});
//     //
//     // Watchers
//     //
//     $scope.$on('OptOutItemUnlinked', function(ev, companyid) {
//         unlinkCompany(companyid);
//     });
//     $scope.$watch('vm.account', function(nv, ov) {
//         if (nv != ov) {
//             vm.form.account.$dirty = true;
//         }
//     }, true);
//     //
//     // Bootstrap
//     //
//     vm.saveAccount = saveAccount;
//     vm.savePassword = savePassword;
//     vm.pristineAccount = pristineAccount;
//     vm.deactivateAccount = deactivateAccount;
//     vm.form = {
//         account: {},
//         password: {}
//     };
//     // attributes of opt-out component
//     vm.optOutInfo = optOutInfo;
//     vm.optOutPutLocation = api.url + '/api/profiles/opt-out';
//     vm.optOutPutParams = {
//         company: $user.instance().current('company')._id
//     };
//     bootstrap();

//     function bootstrap() {
//         //instantiate new account
//         vm.account = $account.set(new $Account({
//             email: $user.instance().email,
//             facebook: $user.instance().facebook,
//             id: $user.instance().id,
//             provider: $user.instance().provider,
//             profile: $user.instance().profile,
//             role: ($user.setting.roleForCompany != 'user') ? $user.instance().profile.role : $user.instance().role
//         }));
//         vm.accountPristine = angular.copy(vm.account);
//         $timeout(function() {
//             dirty(false);
//         }, 1000)
//     }
//     //handle pra confirmação de conta
//     function confirmAccount(cbSuccess, cbFail) {
//         //confirm account identity
//         vm.account.confirm(onSuccessConfirm, onFailConfirm);
//         //handle confirm account success
//         function onSuccessConfirm(response) {
//             if (cbSuccess) cbSuccess(response)
//         }
//         //handle confirm account fail
//         function onFailConfirm(response) {
//             if (cbFail) cbFail(response)
//         }
//     }

//     function saveAccount() {
//         confirmAccount(function() {
//             $page.load.init();
//             //company unlink
//             $http.put(api.url + '/api/profiles/' + $user.instance().profile.id + '/updateInfo', {
//                 firstName: vm.account.profile.firstName, //nome do perfil
//                 lastName: vm.account.profile.lastName, //sobrenome do perfil
//                 email: vm.account.email, //email da conta e nao do perfil (email do perfil será usado para contatos profissionais)
//             }).success(onSuccessUpdateInfo).error(onFailUpdateInfo);
//             //handle unlink success
//             function onSuccessUpdateInfo(response) {
//                 var _user = response.user;
//                 var _profile = response;
//                 delete _profile.user;
//                 $user.instance().profile = _profile; //atualizar profile
//                 $user.set(new $User($user.instance())); //re-instanciar usuario
//                 bootstrap(); //re-instanciar profile
//                 $page.toast('Dados atualizados');
//                 $page.load.done();
//                 $rootScope.$emit('AccountUpdated');
//             }
//             //handle unlink fail
//             function onFailUpdateInfo(response) {
//                 $page.toast('não foi possível atualizar seus dados ' + response.error ? response.error : '');
//                 $page.load.done();
//             }
//         });
//     }

//     function unlinkCompany(id) {
//         confirmAccount(function() {
//             $page.load.init();
//             //company unlink
//             $http.put(api.url + '/api/profiles/' + $user.instance().profile.id + '/unlinkCompany', {
//                 cid: id
//             }).success(onSuccessUnlink).error(onFailUnlink);
//             //handle unlink success
//             function onSuccessUnlink(response) {
//                 var _user = response.user;
//                 var _profile = response;
//                 delete _profile.user;
//                 $user.instance().profile = _profile; //atualizar profile
//                 $user.instance().current('companies', _profile.role); //re-setar empresas atuais
//                 if (!$user.instance().current('companies').length || !$user.instance().current('companies')[0].company || !$user.instance().current('companies')[0].company._id) {
//                     $user.instance().current('company', {}); //zerar empresa atual se nao existir mais nenhuma
//                 }
//                 $user.set(new $User($user.instance())); //re-instanciar usuario
//                 bootstrap();
//                 $page.toast('empresa desconectada');
//                 $page.load.done();
//                 $rootScope.$emit('AccountUpdated');
//             }
//             //handle unlink fail
//             function onFailUnlink(response) {
//                 $page.toast('não foi possível desconectar da empresa  ' + response.error ? response.error : '');
//             }
//         });
//     }

//     function savePassword() {
//         confirmAccount(function() {
//             $page.load.init();
//             $http.put(api.url + '/api/profiles/' + $user.instance().id + '/updatePassword', {
//                 pw: vm.account._password,
//             }).success(onSuccessUpdatePassword).error(onFailUpdatePassword);

//             function onSuccessUpdatePassword(response) {
//                 $page.toast('Senha atualizada');
//                 $page.load.done();
//                 bootstrap();
//             }

//             function onFailUpdatePassword(response) {
//                 $page.toast('não foi possível alterar sua senha ' + response && response.error ? response.error : '');
//                 $page.load.done();
//             }
//         });
//     }

//     function deactivateAccount(ev) {
//         $mdDialog.show({
//             controller: /*@ngInject*/ function($scope, $mdDialog, $location, $user, account, api) {
//                 $scope.user = $user.instance();
//                 $scope.account = account.instance;
//                 $scope.gender = (account.instance.profile && account.instance.profile.gender === 'F') ? 'a' : 'o';
//                 $scope.hide = function() {
//                     $mdDialog.hide();
//                 };
//                 $scope.cancel = function() {
//                     $mdDialog.cancel();
//                 };
//                 $scope.confirm = function() {
//                     confirmAccount(function() {
//                         $page.load.init();
//                         //company unlink
//                         $http.put(api.url + '/api/profiles/' + $user.instance().profile.id + '/deactivateAccount').success(onSuccessDeactivate).error(onFailDeactivate);
//                         //handle unlink success
//                         function onSuccessDeactivate(response) {
//                             $page.toast('Sua conta foi cancelada, você será desconectado em 5 segundos...');
//                             $page.load.done();
//                             $timeout(function() {
//                                 $user.instance().destroy();
//                                 $location.path('/');
//                             }, 5000);
//                         }
//                         //handle unlink fail
//                         function onFailDeactivate(response) {
//                             $page.toast('não foi possível cancelar sua conta, por favor entre em contato ' + response.error ? response.error : '');
//                         }
//                     });
//                 };
//             },
//             templateUrl: 'core/account/deactivate.tpl.html',
//             parent: angular.element(document.body),
//             targetEvent: ev
//         }).then(function() {
//             this.busy = false;
//         }.bind(this), function() {
//             this.busy = false;
//         }.bind(this));
//     }

//     function optOutInfo(item) {
//         return item.position.length ? 'em ' + item.position.length + ' área' + (item.position.length > 1 ? 's' : '') /*+ ' associada' + (item.position.length > 1 ? 's' : '')*/ : 'nenhuma área';
//     }

//     function pristineAccount() {
//         return (vm.accountPristine.profile.firstName === vm.account.profile.firstName) && (vm.accountPristine.profile.lastName === vm.account.profile.lastName) && (vm.accountPristine.profile.email === vm.account.profile.email);
//     }

//     function dirty(status) {
//         vm.form.account.$dirty = status;
//         vm.form.password.$dirty = status;
//     }
// })