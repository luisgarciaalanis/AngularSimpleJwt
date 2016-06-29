/**
 * JwtAuthProvider
 */
JwtAuth.provider('JwtAuth', function() {
    var auth = null;
    this.loginUrl = '';
    this.logoutRedirect = '';

    this.$get = ['$q', '$http', '$location', 'AuthToken', function AuthFactory($q, $http, $location, AuthToken) {
        if (auth  === null) {
            auth = new Auth($q, $http, $location, AuthToken, this.loginUrl, this.logoutRedirect);
        }

        return auth;
    }];
});
