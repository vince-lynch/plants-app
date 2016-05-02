angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource', '$window', '$state', 'GEOCODER_API_KEY', '$http', 'GUARDIAN_API_KEY', '$window','$scope', '$document'];
function MainController($auth, tokenService, $resource, $window, $state, GEOCODER_API_KEY, $http, GUARDIAN_API_KEY, $window,$scope,$document) {
  var self = this;

 self.palmHealth = 0;
  self.daisyHealth = 0;
  self.currentweatherstate = "";
  self.currentweathercode = 0;
  self.currentweathertemp = 0;
  self.lastwatered = "never before";
  self.lastWeatherState = "" 
  self.timesPalmWateredDuringCurrentSession = 0;

  $scope.itemLocations = {palmX: 63, palmY: -267, daisyX: 103, daisyY: -267, weatherX: 560,weatherY: 129, wateringcanX: 300, wateringcanY: -67}


  var socket = $window.io();

  var self = this;
  self.messages = [];
  self.history = [];
  self.message = null;
  self.username = "";
  self.hasSetUsername = false;

  self.setUsername = function() {
    if(self.username.length > 2) self.hasSetUsername = true;
    self.message = "login";
    self.socketlogin();
    self.message = null;
  }

  self.viewHistory = function(){
    console.log(self.history);
  }

  self.retrieveActivity = function(message){
    console.log(message);
    self.history.push({ text: message.text, username: message.email,lastwatered: message.lastwatered, palmHealth: message.palmHealth, daisyHealth: message.daisyHealth, palmX: message.palmX, palmY: message.palmY, daisyX: message.daisyX,daisyY: message.daisyY, lastWeatherState: message.lastWeatherState});

    self.lastHistory = _.last(self.history);

    self.lastwatered = self.lastHistory.lastwatered;
    self.palmHealth = self.lastHistory.palmHealth; 
    self.daisyHealth = self.lastHistory.daisyHealth;
/*    $scope.itemLocations = {palmX: self.lastHistory.palmX, palmY: self.lastHistory.palmY, daisyX: self.lastHistory.daisyX, daisyY: self.lastHistory.daisyY,weatherX: 662,weatherY: 129, wateringcanX: 337, wateringcanY: 259 }*/


    self.plantGrowthLogic()
  }

  socket.on('message', function(message) {
    $scope.$applyAsync(function() {

      if (message.text){
        self.messages.push(message);
      }
      if (message.history != undefined){
        self.history = message.history;
      }
      self.retrieveActivity(message);
      
    });
  });

  self.plantGrowthLogic = function(){
  var n = _.now()
  var currentTime = n;

  $window.appHistory = self.history;

////// last cloudy
var lastCloudy = _.findLastIndex(self.history, function(o) { return o.lastWeatherState == 'cloudy'; });

if (lastCloudy == -1){
  console.log("its never been recorded cloudy before");
} else {
  var timeLastCloudy = self.history[lastCloudy].lastwatered
  var minutesSinceCloudy = (currentTime - timeLastCloudy) / 1000;
  minutesSinceCloudy = minutesSinceCloudy / 60;
  minutesSinceCloudy = Math.round(minutesSinceCloudy);

}

////// last sunny
var lastSunny = _.findLastIndex(self.history, function(o) { return o.lastWeatherState == 'sunny'; });
  if (lastSunny == -1){
    console.log("its never been recorded sunny before");
  } else {
    var timeLastSunny = self.history[lastSunny].lastwatered
    var minutesSinceSunny = (currentTime - timeLastSunny) / 1000;
    minutesSinceSunny = minutesSinceSunny / 60;
    minutesSinceSunny = Math.round(minutesSinceSunny);

  }

  ////// last sunny
  var lastRainy = _.findLastIndex(self.history, function(o) { return o.lastWeatherState == 'rainy'; });
    if (lastRainy == -1){
      console.log("its never been recorded rainy before");
    } else {
      var timeLastRainy = self.history[lastRainy].lastwatered
      var minutesSinceRainy = (currentTime - timeLastRainy) / 1000;
      minutesSinceRainy = minutesSinceRainy / 60;
      minutesSinceRainy = Math.round(minutesSinceRainy);
    }


     if (self.lastwatered == undefined){
        // Time
        var n = _.now()
        self.lastwatered = n;
     } else {
       self.lastwatered = self.lastwatered;
     }

/*

    var minutesSinceLastWatered = ((currentTime - self.lastwatered) / 60) / 1000;
    minutesSinceLastWatered = Math.round(minutesSinceLastWatered);

    self.palmHealth = self.palmHealth - minutesSinceLastWatered;

    if (self.palmHealth < 0){ self.palmHealth = 0}
    if (self.palmHealth > 15){ self.palmHealth = 15}

    console.log("minutes since last watered :" + minutesSinceLastWatered);*/
     console.log("new plant health minus minutes not watered : " + self.palmHealth)
  }

  self.socketlogin = function() {
    socket.emit('message', { text: self.message, username: self.username});
    self.message = null;
  }

  self.sendMessage = function() {
    socket.emit('message', { text: self.message, username: self.username, lastwatered: self.lastwatered, palmHealth: self.palmHealth, daisyHealth: self.daisyHealth, palmX: $scope.itemLocations.palmX, palmY: $scope.itemLocations.palmY,daisyX: $scope.itemLocations.daisyX,daisyY: $scope.itemLocations.daisyY, lastWeatherState: self.lastWeatherState, history: self.history});
   // self.messages.push({ text: self.message, username: 'someuser' });
    self.message = null;
  }

  $scope.storeDraggableItemsLocations = function(){
    $scope.itemLocations.palmX = $window.palmX;
    $scope.itemLocations.palmY = $window.palmY;
    $scope.itemLocations.daisyX = $window.daisyX;
    $scope.itemLocations.daisyY = $window.daisyY;
    self.message = "updatePlant";
    self.sendMessage();
  }




  self.updatePlant = function(){
    if (self.palmHealth < 0){ self.palmHealth = 0}
    if (self.palmHealth > 15){ self.palmHealth = 15}
    if (self.daisyHealth < 0){ self.daisyHealth = 0}
    if (self.daisyHealth > 15){ self.daisyHealth = 15}
      // Time
      var n = _.now()
      self.lastwatered = n;
      self.message = "updatePlant";
      self.sendMessage();
      self.message = null;
  }



  self.changeweathergraphic = function(){

/*    console.log("current weather code is " + self.currentweathercode)*/
    self.currentweathercode = parseInt(self.currentweathercode)
/*    console.log(self.currentweathercode);*/
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
      self.lastWeatherState = "stormy";
    } else if (currentweathercode == 5 ||currentweathercode == 6 ||currentweathercode == 7 ||currentweathercode == 8 ||currentweathercode == 10 ||currentweathercode == 13 ||currentweathercode == 14 ||currentweathercode == 15 ||currentweathercode == 16 ||currentweathercode == 17 ||currentweathercode == 18 ||currentweathercode == 46 ||currentweathercode == 41 ||currentweathercode == 42 ||currentweathercode == 43 ||currentweathercode == 35){
      $scope.snowy = true;
      self.lastWeatherState = "snowy";
    } else if (currentweathercode == 11 ||currentweathercode == 12 ||currentweathercode == 40 || currentweathercode ==  39 || currentweathercode ==  38){
      $scope.rainy = true;
      self.lastWeatherState = "rainy";
    } else if(currentweathercode == 19 || currentweathercode == 20 || currentweathercode == 22 || currentweathercode == 23 || currentweathercode == 24 || currentweathercode == 26 || currentweathercode == 29){
      $scope.cloudy = true;
      self.lastWeatherState = "cloudy";
    } else if(currentweathercode == 27 ||currentweathercode == 29 ||currentweathercode == 31 ||currentweathercode == 33){
      $scope.starry = true;
      self.lastWeatherState = "starry";
    } else if(currentweathercode == 32 ||currentweathercode == 34 ||currentweathercode == 36 || currentweathercode == 28 ||currentweathercode == 30){
      $scope.sunny = true;
      self.lastWeatherState = "sunny";
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



  self.growplant = function(){
    if ($window.currentlyBeingWatered == "palm"){
      self.palmHealth++
    } else if ($window.currentlyBeingWatered == "daisy"){
      console.log("attempting to grow daisy")
      self.daisyHealth++
    } 
    $scope.$apply();
    self.updatePlant();
  }

}