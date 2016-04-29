angular.module('VinceLynch')
.controller('SocketsController', SocketsController);

SocketsController.$inject = ['$window', '$scope'];
function SocketsController($window, $scope) {

  var socket = $window.io();

  var self = this;
  self.messages = [];

  self.message = null;
  self.username = "";
  self.hasSetUsername = false;

  self.setUsername = function() {
    if(self.username.length > 2) self.hasSetUsername = true;
  }

  socket.on('message', function(message) {
    $scope.$applyAsync(function() {
      self.messages.push(message);
    });
  });

  self.sendMessage = function() {
    socket.emit('message', { text: self.message, username: self.username });
   // self.messages.push({ text: self.message, username: 'someuser' });
    self.message = null;
  }
}