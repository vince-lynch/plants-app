angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource', '$window', '$state', 'GEOCODER_API_KEY', '$http', 'GUARDIAN_API_KEY', '$window','$scope'];
function MainController($auth, tokenService, $resource, $window, $state, GEOCODER_API_KEY, $http, GUARDIAN_API_KEY, $window,$scope) {
  var self = this;
  self.helloworld = "hello world";
/* self.seg1 = true;
  self.seg2 = true;
  self.seg3 = true;
  self.seg4 = true;
  self.seg5 = true;
  self.seg6 = true;
  self.seg7 = true;
  self.seg8 = true;
  self.seg9 = true;
  self.seg10 = true;
  self.seg11 = true;*/
  self.wateringCount = 0;
  $scope.sunny = true;

  $scope.growplant = function(){
    console.log("function called")
    self.wateringCount ++;
    if (self.wateringCount == 1){
      self.seg1 = true;
    }
    if (self.wateringCount == 2){
      self.seg2 = true;
    }
    if (self.wateringCount == 3){
      self.seg3 = true;
    }
    if (self.wateringCount == 4){
      self.seg4 = true;
    }
    if (self.wateringCount == 5){
      self.seg5 = true;
    }
    if (self.wateringCount == 6){
      self.seg6 = true;
    }
    if (self.wateringCount == 7){
      self.seg11 = true;
    }
    if (self.wateringCount == 8){
      self.seg7 = true;
    }
    if (self.wateringCount == 9){
      self.seg12 = true;
    }
    if (self.wateringCount == 10){
      self.seg8 = true;
    }
    if (self.wateringCount == 11){
      self.seg13 = true;
    }
    if (self.wateringCount == 12){
      self.seg9 = true;
    }
    if (self.wateringCount == 13){
      self.seg14 = true;
    }
    if (self.wateringCount == 14){
      self.seg10 = true;
    }
    if (self.wateringCount == 15){
      self.seg15 = true;
    }
    $scope.$apply();
  }

  $scope.dragOptions = {
          start: function(e) {
            console.log("STARTING");
          },
          drag: function(e) {
            console.log("DRAGGING");
          },
          stop: function(e) {
            console.log("STOPPING");
          },
          container: 'container'
      }


}
