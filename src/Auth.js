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
