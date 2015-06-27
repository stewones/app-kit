'use strict';
/* global moment, confirm */
angular.module('profile.module').controller('ProfileFormCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, $log, utils, layout, user, Profile, setting, api) {
    var vm = this;
    //
    // Estados Brasileiros
    //
    vm.states = utils.brStates();
    //
    // Tipos de CNH
    //
    vm.cnh = ["A", "B", "C", "D"];
    //
    // Idiomas
    //
    vm.idioms = ["Inglês", "Italiano", "Espanhol", "Francês", "Japonês", "Russo", "Aramaico", "Árabe", "Mandarim"];
    vm.idiomsLevel = ["Básico", "Intermediário", "Fluente"];
    //
    // Form
    //
    vm.save = save;
    vm.add = add;
    vm.remove = remove;
    vm.forms = {
        profile: {}
    };
    vm.hasFormError = hasFormError;
    vm.hasFormErrorToast = hasFormErrorToast;
    vm.setAddrByCep = setAddrByCep;
    vm.hideActionAddWhen = hideActionAddWhen;
    vm.cycleXpMonths = cycleXpMonths;
    vm.education = {};
    vm.education.schooling = [];
    vm.education.technical = [];
    vm.education.graduation = [];
    //
    // Tabs
    //
    var tabs = [{
        name: 'Cargos',
        slug: 'positions',
        title: "<i class='fa fa-heartbeat'></i> Área de Interesse",
        subtitle: "Escolha em quais cargos você se encaixa em <strong>" + user.instance.current('company').name + "</strong>",
        template: "app/profile/form/profileForm-step1.tpl.html"
    }, {
        name: 'Dados Pessoais',
        slug: 'personal',
        title: "<i class='fa fa-smile-o'></i> Dados Pessoais",
        subtitle: "Algumas informações sobre você",
        template: "app/profile/form/profileForm-step2.tpl.html"
    }, {
        name: 'Curso',
        slug: 'graduation',
        title: "<i class='fa fa-graduation-cap'></i> Formação e Cursos",
        subtitle: "Nos informe sua formação escolar e cite alguns cursos que já tenha realizado",
        template: "app/profile/form/profileForm-step3.tpl.html"
    }, {
        name: 'Experiência',
        slug: 'xps',
        title: "<i class='fa fa-flask'></i> Experiências",
        subtitle: "Conte-nos um pouco sobre sua trajetória.",
        template: "app/profile/form/profileForm-step4.tpl.html"
    }, {
        name: 'Idioma',
        slug: 'idioms',
        title: "<i class='fa fa-language'></i> Idiomas",
        subtitle: "Especifique alguns idiomas que você fale",
        template: "app/profile/form/profileForm-step5.tpl.html"
    }];
    $scope.tabs = tabs;
    $scope.tabCurrent = 0;
    //
    // Education
    //
    function education() {
        var url = api.url + '/api/configs/education';
        var onSuccess = function(education) {
            vm.education = education;
            user.instance.current('education', education);
            $timeout(function() {
                vm.educationLoading = false;
            }, 1000);
        }
        var onFail = function() {
            layout.toast('Impossible to load education options');
            $timeout(function() {
                vm.educationLoading = false;
            }, 1000);
        }
        if (!user.instance.current('education')) {
            vm.educationLoading = true;
            $http.post(url, {
                company: user.instance.current().company._id
            }).success(onSuccess).error(onFail);
        } else {
            vm.education = user.instance.current('education');
        }
    }
    //
    // Events
    //
    $rootScope.$on('CompanyIdUpdated', function() {
        bootstrap(user.instance.profile);
        // $timeout(function() {
        $scope.tabCurrent = 0;
        // }, 2000)
    });
    //
    // Watchers
    //           
    $scope.$watch('tabCurrent', function() {
        if (tabs[$scope.tabCurrent].slug === 'graduation') {
            education();
        }
    });
    $scope.$watch('vm.profile.positions', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.doc.cnh', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.courses', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.graduation', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.schooling', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.technical', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.idioms', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.xp.companies', function(nv, ov) {
        if (nv != ov) {
            vm.forms.profile.$dirty = true;
            cycleXpMonths(nv);
        }
    }, true);
    //
    // Bootstrap
    //
    bootstrap(user.instance.profile);

    function bootstrap(params) {
        if (!$auth.isAuthenticated()) return;
        //update tab with company name
        $scope.tabs[0].subtitle = "Escolha em quais cargos você se encaixa em <strong>" + user.instance.current('company').name + "</strong>";
        //
        // Profile corrente
        //
        vm.profile = new Profile(params);
        vm.profile.company = user.instance.current('company')._id; //vincular empresa no perfil atual
        //
        // Empresa corrente
        //
        vm.company = user.instance.current('company');
        //
        // Feedback
        //
        vm.feedback = [{
            value: "indicacao",
            label: "Indicação"
        }, {
            value: "oferta",
            label: "Anúncios"
        }, {
            value: "companySite",
            label: "Site " + user.instance.current('company').name
        }, {
            value: "google",
            label: "Google"
        }, {
            value: "facebook",
            label: "Facebook"
        }, {
            value: "outros",
            label: "Outros meios"
        }]
    }
    //
    // Behaviors
    //
    function cycleXpMonths(companies) {
        if (!companies) companies = vm.profile.xp.companies;
        var total = 0;
        companies.forEach(function(company) {
            if (company.start && company.end) {
                total += Math.floor(moment(company.end, 'DD/MM/YYYY').diff(moment(company.start, 'DD/MM/YYYY'), 'months', true));
            }
        });
        vm.profile.xp.months = total;
    }

    function save() {
        vm.profile.save(function(response) {
            user.instance.profileUpdate(response);
            user.instance.current('companies', response.role);
            bootstrap(response);
            $timeout(function() {
                vm.forms.profile.$dirty = false;
            }, 500);
            if (tabs[$scope.tabCurrent].slug != 'graduation' && tabs[$scope.tabCurrent].slug != 'xps') {
                if ($scope.tabCurrent < 4) $scope.tabCurrent++; //proxima etapa
                //else
                // $scope.tabCurrent = 0; //vai pro inicio
            }
        });
    }

    function hasFormError(name) {
        var result = false;
        if (vm.forms.profile.$error) {
            if (vm.forms.profile.$error.required && vm.forms.profile.$error.required.length) angular.forEach(vm.forms.profile.$error.required, function(row) {
                if (row.$name === name) {
                    result = true;
                    return;
                }
            })
        }
        return result;
    }

    function hasFormInvalid() {
        return vm.forms.profile.$invalid;
    }

    function hasFormErrorToast() {
        if (hasFormInvalid() && $scope.tabCurrent !== 0) {
            layout.toast(user.instance.profile.firstName + ', verifique todos os campos e corrija os erros.', 10000);
        }
    }

    function setAddrByCep() {
        var cep = vm.profile.address.
        default.cep;
        if (cep && cep.toString().length === 8) {
            var url = api.url + '/api/cep/';
            //layout.load.init();
            var onSuccess = function(response) {
                //layout.load.done();
                var addr = response.data;
                vm.profile.address.
                default.street = addr.street;
                vm.profile.address.
                default.district = addr.district;
                vm.profile.address.
                default.city = addr.city;
                vm.profile.address.
                default.state = addr.state;
            }
            var onError = function() {
                layout.load.done();
            }
            $http.get(url + cep, {}).then(onSuccess, onError);
        }
    }

    function hideActionAddWhen() {
        return tabs[$scope.tabCurrent].slug != 'graduation' && tabs[$scope.tabCurrent].slug != 'idioms' && tabs[$scope.tabCurrent].slug != 'xps';
    }

    function add() {
        //adicionar curso
        if (tabs[$scope.tabCurrent].slug === 'graduation') {
            vm.profile.education.courses.unshift({
                name: '',
                hours: ''
            });
        }
        //adicionar idioma
        if (tabs[$scope.tabCurrent].slug === 'idioms') {
            vm.profile.education.idioms.unshift({
                idiom: '',
                level: ''
            });
        }
        //adicionar xp
        if (tabs[$scope.tabCurrent].slug === 'xps') {
            vm.profile.xp.companies.unshift({
                name: '',
                position: '',
                start: '',
                end: '',
                info: '',
                current: ''
            });
        }
        $scope.$emit('itemAdded');
    }

    function remove(item) {
        var index;
        //remover curso
        if (tabs[$scope.tabCurrent].slug === 'graduation') {
            index = vm.profile.education.courses.indexOf(item);
            if (confirm('Certeza que deseja remover o curso ' + item.name + '?')) {
                vm.profile.education.courses.splice(index, 1);
            }
        }
        //remover idioma
        if (tabs[$scope.tabCurrent].slug === 'idioms') {
            index = vm.profile.education.idioms.indexOf(item);
            if (confirm('Certeza que deseja remover o idioma ' + item.lang + '?')) {
                vm.profile.education.idioms.splice(index, 1);
            }
        }
        //remover xp
        if (tabs[$scope.tabCurrent].slug === 'xps') {
            index = vm.profile.xp.companies.indexOf(item);
            if (confirm('Certeza que deseja remover a empresa ' + item.name + ' de suas experiências?')) {
                vm.profile.xp.companies.splice(index, 1);
            }
        }
    }
})