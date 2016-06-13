/**
 * AuthToken Service
 */
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
