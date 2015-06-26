'use strict';
angular.module('app.utils').factory('Fb', /*@ngInject*/ function(Facebook) {
    return {
        getLikes: getLikes,
        getFriends: getFriends,
        checkPerms: checkPerms,
        userLikedPage: userLikedPage,
        session: session
    }

    function getLikes(id, cb) {
        return Facebook.api("/" + id + "/likes", cb);
    }

    function getFriends(id, cb) {
        return Facebook.api("/" + id + "/friends", cb);
    }

    function checkPerms(id, cb) {
        return Facebook.api("/" + id + "/permissions", cb);
    }

    function userLikedPage(id, company, cb) {
        return Facebook.api("/" + id + "/likes/" + company, function(response) {
            //handle "An access token is required to request this resource." when pages refresh
            if (response.error && response.error.code === 104) {
                // numa listagem isso nao fica mto legal =(
                // Facebook.login(function(response) {
                //     return userLikedPage(id, company, cb);
                // }, {
                //     scope: setting.facebook.scope || 'email'
                // });
            } else {
                //handle success request
                return cb(response);
            }
        });
    }

    function session() {
        /*            Facebook.api("/" + id + "/likes/" + company, function(response) {
                //handle "An access token is required to request this resource." when pages refresh
                if (response.error && response.error.code === 104) {
                    Facebook.login(function(response) {
                        return userLikedPage(id, company, cb);
                    }, {
                        scope: setting.facebook.scope || 'email'
                    });
                } else {
                    //handle success request
                    return cb(response);
                }
            });*/
        /* Facebook.getLoginStatus(function(response) {
                  console.log(response)
                if (response.status === 'connected') {
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token 
                    // and signed request each expire
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;

                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook, 
                    // but has not authenticated your app
                } else {
                    // the user isn't logged in to Facebook.
                }
            });*/
    }
})