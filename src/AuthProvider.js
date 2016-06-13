/**
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
