JwtAuth.factory('HttpAuthInterceptor', ['AuthToken', function(AuthToken) {
    /**
     * Sets the Http interceptor to add the token on every http* call if available
     * 
     * @param AuthToken
     * @constructor
     */
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
