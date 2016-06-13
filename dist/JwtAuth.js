(function(){
"use strict";
var JwtAuth = angular.module('JwtAuth', ['ngStorage']);


function Auth($q, $http, $rootRouter, AuthToken, loginUrl, logoutRedirect) {
    /**
     * Method to verify if the user is authenticated
     *
     * @returns true if the user is authenticated
     *          false if the user is not authenticated
     */
    this.isAuthenticated = function() {
        return AuthToken.isAuthenticated();
    };

    /**
     * Sets the state of Auth to logged out
     */
    this.logout = function() {
        AuthToken.deleteToken();
        $rootRouter.navigate(logoutRedirect);
    };

    /**
     * Thie method logs in given a set of credentials. We POST a message to the server tp get authenticated, the server
     * will return a token that we will store and use it as a token to send with every request to the server to be
     * granted access to the different API calls.
     *
     * @param credentials
     * @returns a promise to be called when we get a response from the server.
     */
    this.login = function(credentials) {
        var loginPromise = $q.defer();
        $http.post(loginUrl, credentials).then(
            function(response) {
                AuthToken.setToken(response.data.token);
                loginPromise.resolve(response);
            },
            function(response) {
                loginPromise.reject(response);
            }
        );

        return loginPromise.promise;
    };
}

/*
* AuthProvider
*/
JwtAuth.provider('jwtAuth', function() {
    var auth = null;
    this.loginUrl = '';
    this.logoutRedirect = '';

    this.$get = ['$q', '$http', '$rootRouter', 'AuthToken', function AuthFactory($q, $http, $rootRouter, AuthToken) {
        if (auth  === null) {
            auth = new Auth($q, $http, $rootRouter, AuthToken, this.loginUrl, this.logoutRedirect);
        }

        return auth;
    }];
});

JwtAuth.service('AuthToken', ['$window', '$localStorage', function AuthToken($window, $localStorage) {
    var self = this;
    var cachedToken = $localStorage.token;

    /**
    * Stores a new JWT token
    * @param token
    */
    this.setToken = function(token) {
        $localStorage.token = token;
        cachedToken = token;
    };

    /**
    * Gets the current JWT token,
    * it returns null if no token is available
    * @returns {*|null}
    */
    this.getToken = function() {
        if (cachedToken) {
            cachedToken = $localStorage.token;
            return cachedToken;
        } else {
            return null;
        }
    };

    /**
    * Deletes the JWT token
    */
    this.deleteToken = function() {
        if ($localStorage.token !== undefined) {
            cachedToken = undefined;
            delete $localStorage.token;
        }
    };

    /**
    * Called to verify if we have a valid auth token.
    * @returns {boolean}
    */
    this.isAuthenticated = function() {
        var token = self.getToken();
        var result = false;

        if (token) {
            if (token.split('.').length === 3) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var exp = JSON.parse($window.atob(base64)).exp;

                if (exp) {
                    var isExpired = Math.round(new Date().getTime() / 1000) >= exp;

                    if (isExpired) {
                        self.deleteToken();
                    } else {
                        result = true;
                    }
                }
            }
        }

        return result;
    };
}]);

JwtAuth.factory('HttpAuthInterceptor', ['AuthToken', function(AuthToken) {
    function HttpAuthInterceptor(AuthToken) {
        this.request = function(config) {
            var token = AuthToken.getToken();

            if (token !== '') {
                config.headers.Authorization = 'Bearer ' + token;
            }

            return config;
        };

        this.response = function(response) {
           return response;
        };
    }

    return new HttpAuthInterceptor(AuthToken);
}]);

JwtAuth.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('HttpAuthInterceptor');
}]);


})();