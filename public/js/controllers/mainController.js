angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource', '$window', '$state', 'GEOCODER_API_KEY', '$http', 'GUARDIAN_API_KEY', '$window','$scope', '$document'];
function MainController($auth, tokenService, $resource, $window, $state, GEOCODER_API_KEY, $http, GUARDIAN_API_KEY, $window,$scope,$document) {
  var self = this;

  self.plantHealth = 0;
  self.currentweatherstate = "";
  self.currentweathercode = 0;
  self.currentweathertemp = 0;
  self.lastwatered = "never before";
  self.timesPalmWateredDuringCurrentSession = 0;

  self.palmX = 0;
  self.palmY = 0;

  $scope.field = {};
/*  $scope.field.left = 0;
  $scope.field.top = 0;*/


  var socket = $window.io();

  var self = this;
  self.messages = [];

  self.message = null;
  self.username = "";
  self.hasSetUsername = false;

  self.setUsername = function() {
    if(self.username.length > 2) self.hasSetUsername = true;
    self.message = "login";
    self.socketlogin();
    self.message = null;
  }

  socket.on('message', function(message) {
    $scope.$applyAsync(function() {

      if (message.text != null){
        self.messages.push(message);
      }
      console.log(message);


      self.lastwatered = message.lastwatered;
      self.plantHealth = message.plantHealth; 
      self.palmX = message.palmX;
      self.palmY = message.palmY;
      self.moveTree();

       if (message.lastwatered == undefined){
         self.lastwatered = Date();
       } else {
         self.lastwatered = message.lastwatered;
       }
       var lasttimemin = self.lastwatered.split(" ")[4].split(":")[1];
       var lasttimeHrs = self.lastwatered.split(" ")[4].split(":")[0];
      var timenow = Date().split(" ")[4].split(":");
      var minutesAgo = (timenow[1]) - (parseInt(lasttimemin));
      var hoursAgo = (timenow[0]) - (parseInt(lasttimeHrs))
      console.log(minutesAgo + " minutes ago since last watered");
      console.log(hoursAgo + " hours ago since last watered");

      self.plantHealth = self.plantHealth - minutesAgo;
      if (self.plantHealth < 0){ self.plantHealth = 0}
      if (self.plantHealth > 15){ self.plantHealth = 15}
       console.log("new plant health minus minutes not watered" + self.plantHealth)

      $scope.plantStatus();
    });
  });

  self.socketlogin = function() {
    socket.emit('message', { text: self.message, username: self.username});
    self.message = null;
  }

  self.sendMessage = function() {
    socket.emit('message', { text: self.message, username: self.username, lastwatered: self.lastwatered, plantHealth: self.plantHealth, palmX: self.palmX, palmY: self.palmY});
   // self.messages.push({ text: self.message, username: 'someuser' });
    self.message = null;
  }

  $scope.storePalmLocation = function(){
    if (self.plantHealth < 0){ self.plantHealth = 0}
    if (self.plantHealth > 15){ self.plantHealth = 15}
    console.log("awesome storing palm location" + $window.palmX + "x axis" + $window.palmY + "y axis")
    self.palmX = $window.palmX;
    self.palmY = $window.palmY;
    self.message = "updatePlant";
    self.sendMessage();
  }


  self.moveTree = function(){
    var left = self.palmX + "px";
    var top = self.palmY + "px";
    $scope.field = {top:top, left};
  }


  self.updatePlant = function(){
    if (self.plantHealth < 0){ self.plantHealth = 0}
    if (self.plantHealth > 15){ self.plantHealth = 15}
      self.lastwatered = Date()
      self.message = "updatePlant";
      self.sendMessage();
      self.message = null;
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

    if (currentweathercode == 3 || currentweathercode == 4 ||currentweathercode ==  37 ||currentweathercode ==  45 || currentweathercode == 47 ){
      console.log("stormy if condition met");
      $scope.stormy = true;
    } else if (currentweathercode == 5 ||currentweathercode == 6 ||currentweathercode == 7 ||currentweathercode == 8 ||currentweathercode == 10 ||currentweathercode == 13 ||currentweathercode == 14 ||currentweathercode == 15 ||currentweathercode == 16 ||currentweathercode == 17 ||currentweathercode == 18 ||currentweathercode == 46 ||currentweathercode == 41 ||currentweathercode == 42 ||currentweathercode == 43 ||currentweathercode == 35){
      $scope.snowy = true;
    } else if (currentweathercode == 11 ||currentweathercode == 12 ||currentweathercode == 40 || currentweathercode ==  39 || currentweathercode ==  38){
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
    console.log(self.plantHealth);

    if (self.plantHealth > 15){
      self.plantHealth = 15;
    }

    if (self.plantHealth == 1){
      self.seg1 = true;
    }
    if (self.plantHealth == 2){
      self.seg1 = true;
      self.seg2 = true;
    }
    if (self.plantHealth == 3){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
    }
    if (self.plantHealth == 4){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
    }
    if (self.plantHealth == 5){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
    }
    if (self.plantHealth == 6){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
    }
    if (self.plantHealth == 7){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
    }
    if (self.plantHealth == 8){
      self.seg1 = true;
      self.seg2 = true;
      self.seg3 = true;
      self.seg4 = true;
      self.seg5 = true;
      self.seg6 = true;
      self.seg7 = true;
      self.seg8 = true;
    }
    if (self.plantHealth == 9){
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
    if (self.plantHealth == 10){
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
    if (self.plantHealth == 11){
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
    if (self.plantHealth == 12){
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
    if (self.plantHealth == 13){
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
    if (self.plantHealth == 14){
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
    if (self.plantHealth == 15){
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

    if (self.timesPalmWateredDuringCurrentSession < 4){
      self.timesPalmWateredDuringCurrentSession ++
      self.plantHealth ++;

    if (self.plantHealth == 1){
      self.seg1 = true;
    }
    if (self.plantHealth == 2){
      self.seg2 = true;
    }
    if (self.plantHealth == 3){
      self.seg3 = true;
    }
    if (self.plantHealth == 4){
      self.seg4 = true;
    }
    if (self.plantHealth == 5){
      self.seg5 = true;
    }
    if (self.plantHealth == 6){
      self.seg6 = true;
    }
    if (self.plantHealth == 7){
      self.seg11 = true;
    }
    if (self.plantHealth == 8){
      self.seg7 = true;
    }
    if (self.plantHealth == 9){
      self.seg12 = true;
    }
    if (self.plantHealth == 10){
      self.seg8 = true;
    }
    if (self.plantHealth == 11){
      self.seg13 = true;
    }
    if (self.plantHealth == 12){
      self.seg9 = true;
    }
    if (self.plantHealth == 13){
      self.seg14 = true;
    }
    if (self.plantHealth == 14){
      self.seg10 = true;
    }
    if (self.plantHealth == 15){
      self.seg15 = true;
    }

    $scope.$apply();
    self.updatePlant()

  } else { console.log("Watered Plant Too much this session! Come back later..")} 
  }




}
