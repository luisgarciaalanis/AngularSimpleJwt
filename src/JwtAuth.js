JwtAuth.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('HttpAuthInterceptor');
}]);

