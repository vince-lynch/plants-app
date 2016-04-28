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
  self.currentweatherstate = "";
  self.currentweathercode = 0;
  self.currentweathertemp = 0;
  $scope.sunny = true;
  self.username = "someone@somewherestring.com";

  self.updatePlant = function(){
    $http({
      method: 'PUT',
      url: '/api/plants/' + self.username + '',
      data: {plantHealth: self.wateringCount},
    }).then(function successCallback(response) {
      console.log("updated plants settings " + response);
      }, function errorCallback(response) {
        console.log("failed to update plants settings " + response);
      });
  }

  self.getPlant = function(){
    $http({
      method: 'GET',
      url: '/api/plants/' + self.username + '',
    }).then(function successCallback(response) {
      console.log(response);
      self.wateringCount = response.data.message.plantHealth;
      console.log(self.wateringCount)
      $scope.plantStatus();
      }, function errorCallback(response) {

      });

  }

  self.changeweathergraphic = function(){

    console.log("current weather code is " + self.currentweathercode)
    self.currentweathercode = parseInt(self.currentweathercode)
    console.log(self.currentweathercode);
    // clear weather state
    $scope.sunny = false;
    $scope.cloudy = false;
    $scope.rainy = false;
    $scope.snowy = false;
    $scope.rainbow = false;
    $scope.starry = false;
    $scope.stormy = false;

    var currentweathercode = self.currentweathercode;

    if (currentweathercode == 3 || currentweathercode == 4 ||currentweathercode ==  37 ||  currentweathercode ==  38 || currentweathercode ==  39 ||currentweathercode ==  45 || currentweathercode == 47 ){
      console.log("stormy if condition met");
      $scope.stormy = true;
    } else if (currentweathercode == 5 ||currentweathercode == 6 ||currentweathercode == 7 ||currentweathercode == 8 ||currentweathercode == 10 ||currentweathercode == 13 ||currentweathercode == 14 ||currentweathercode == 15 ||currentweathercode == 16 ||currentweathercode == 17 ||currentweathercode == 18 ||currentweathercode == 46 ||currentweathercode == 41 ||currentweathercode == 42 ||currentweathercode == 43 ||currentweathercode == 35){
      $scope.snowy = true;
    } else if (currentweathercode == 11 ||currentweathercode == 12 ||currentweathercode == 40){
      $scope.rainy = true;
    } else if(currentweathercode == 19 || currentweathercode == 20 || currentweathercode == 22 || currentweathercode == 23 || currentweathercode == 24 || currentweathercode == 26 || currentweathercode == 28 || currentweathercode == 29 || currentweathercode == 30){
      $scope.cloudy = true;
    } else if(currentweathercode == 27 ||currentweathercode == 29 ||currentweathercode == 31 ||currentweathercode == 33){
      $scope.starry = true;
    } else if(currentweathercode == 27 ||currentweathercode == 29 ||currentweathercode == 31 ||currentweathercode == 33){
      $scope.starry = true;
    } else if(currentweathercode == 32 ||currentweathercode == 34 ||currentweathercode == 36){
      $scope.sunny = true;
    }
  }

  self.getWeather = function() {
    $http({
      method: 'GET',
      url: 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast ' +
            'where woeid in (select woeid from geo.places(1) where text="London")&format=json'
    }).then(function successCallback(response) {
        console.log(response);
        console.log("The temperatute in London is " + response.data.query.results.channel.item.condition.temp + response.data.query.results.channel.item.condition.text);

        self.currentweatherstate = response.data.query.results.channel.item.condition.text;

        self.currentweathercode = response.data.query.results.channel.item.condition.code;

        var temp = parseInt(response.data.query.results.channel.item.condition.temp);

        self.currentweathertemp = (5/9) * (temp-32);
       

        self.changeweathergraphic()

      }, function errorCallback(response) {
        console.log(response);
      });
  }

  self.getWeather();

  $scope.plantStatus = function(){
    console.log("plant status function called")
    if (self.wateringCount == 1){
      self.seg1 = true;
    }
    if (self.wateringCount == 2){
      self.seg1 = true;
      self.seg2 = true;
    }
    if (self.wateringCount == 3){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
    }
    if (self.wateringCount == 4){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
    }
    if (self.wateringCount == 5){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
    }
    if (self.wateringCount == 6){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
    }
    if (self.wateringCount == 7){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
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
  }


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
