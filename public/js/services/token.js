angular.module('VinceLynch')
  .service('tokenService', TokenService);

TokenService.$inject = ['$window', 'jwtHelper'];
function TokenService($window, jwtHelper) {
  var self = this;

  self.getToken = function() {
    return $window.localStorage.getItem('token');
  }

  self.removeToken = function() {
    $window.localStorage.removeItem('token');
  }

  self.getUser = function() {
    var token = self.getToken();
    return token ? jwtHelper.decodeToken(token) : null;
  }
}