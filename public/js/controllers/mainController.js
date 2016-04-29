angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource', '$window', '$state', 'GEOCODER_API_KEY', '$http', 'GUARDIAN_API_KEY', '$window','$scope', '$document'];
function MainController($auth, tokenService, $resource, $window, $state, GEOCODER_API_KEY, $http, GUARDIAN_API_KEY, $window,$scope,$document) {
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
  self.lastwatered = "never before";

  self.palmX = 0;
  self.palmY = 0;

  $scope.field = {};
/*  $scope.field.left = 0;
  $scope.field.top = 0;*/

  $scope.storePalmLocation = function(){
    console.log("awesome storing palm location" + $window.palmX + "x axis" + $window.palmY + "y axis")
    self.palmX = $window.palmX;
    self.palmY = $window.palmY;
    $http({
      method: 'PUT',
      url: '/api/plantslocation/' + self.username + '',
      data: {palmX: self.palmX, palmY: self.palmY},
    }).then(function successCallback(response) {
      console.log("updated palm location to DB " + response);
      }, function errorCallback(response) {
        console.log("failed to update palm location to DB " + response);
      });
  }


  self.moveTree = function(){
    var left = self.palmX + "px";
    var top = self.palmY + "px";
    $scope.field = {top:top, left};
  }


  self.updatePlant = function(){
    var currenttime = Date();
    $http({
      method: 'PUT',
      url: '/api/plants/' + self.username + '',
      data: {plantHealth: self.wateringCount, lastwatered: currenttime},
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
      if (response.data.message.lastwatered == undefined){
        self.lastwatered = Date();
      } else {
        self.lastwatered = response.data.message.lastwatered;
      }
      self.palmX = response.data.message.palmX;
      self.palmY = response.data.message.palmY;
      self.moveTree();

      var lasttimemin = self.lastwatered.split(" ")[4].split(":")[1];
      var lasttimeHrs = self.lastwatered.split(" ")[4].split(":")[0];
     var timenow = Date().split(" ")[4].split(":");
     var minutesAgo = (timenow[1]) - (parseInt(lasttimemin));
     var hoursAgo = (timenow[0]) - (parseInt(lasttimeHrs))
     console.log(minutesAgo + " minutes ago since last watered");
     console.log(hoursAgo + " hours ago since last watered");

     self.wateringCount = self.wateringCount - hoursAgo;
     if (self.wateringCount < 0){ self.wateringCount = 0}
      console.log(self.wateringCount)
      $scope.plantStatus();
      $state.go("plants")
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
    if (self.wateringCount > 15){
      self.wateringCount = 15;
    }

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
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
    }
    if (self.wateringCount == 9){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
      self.seg9 = true;
    }
    if (self.wateringCount == 10){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
      self.seg9 = true;
      self.seg10 = true;
    }
    if (self.wateringCount == 11){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
      self.seg9 = true;
      self.seg10 = true;
      self.seg11 = true;
    }
    if (self.wateringCount == 12){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
      self.seg9 = true;
      self.seg10 = true;
      self.seg11 = true;
      self.seg12 = true;
    }
    if (self.wateringCount == 13){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
      self.seg9 = true;
      self.seg10 = true;
      self.seg11 = true;
      self.seg12 = true;
      self.seg13 = true;
    }
    if (self.wateringCount == 14){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
      self.seg9 = true;
      self.seg10 = true;
      self.seg11 = true;
      self.seg12 = true;
      self.seg13 = true;
      self.seg14 = true;
    }
    if (self.wateringCount == 15){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
      self.seg9 = true;
      self.seg10 = true;
      self.seg11 = true;
      self.seg12 = true;
      self.seg13 = true;
      self.seg14 = true;
      self.seg15 = true;
    }
    //self.updatePlant()
  }


  $scope.growplant = function(){
    console.log("growPLANT function called")

     var lasttimemin = self.lastwatered.split(" ")[4].split(":")[1];
     var lasttimeHrs = self.lastwatered.split(" ")[4].split(":")[0];
    var timenow = Date().split(" ")[4].split(":");
    var minutesAgo = (timenow[1]) - (parseInt(lasttimemin));
    var hoursAgo = (timenow[0]) - (parseInt(lasttimeHrs))
    console.log(minutesAgo + " minutes ago since last watered");
    console.log(hoursAgo + " hours ago since last watered");
    
    if (minutesAgo > 8 || hoursAgo > 1 ){
      self.wateringCount ++;
    }

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
    self.updatePlant()
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
