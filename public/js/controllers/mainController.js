angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource', '$window', '$state', 'GEOCODER_API_KEY', '$http', 'GUARDIAN_API_KEY', '$window','$scope', '$document'];
function MainController($auth, tokenService, $resource, $window, $state, GEOCODER_API_KEY, $http, GUARDIAN_API_KEY, $window,$scope,$document) {
  var self = this;

  $scope.weatherBGColor = "#85DB8C";
 self.palmHealth = 0;
  self.daisyHealth = 0;
  self.currentweatherstate = "";
  self.currentweathercode = 0;
  self.currentweathertemp = 0;
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
  self.checkbox = false;

  self.setUsername = function() {
    console.log("trying to set username")
    if(self.username.length > 2) self.hasSetUsername = true;
    self.message = "login";
    self.socketlogin();
    self.message = null;
  }

  self.testbutton = function(){
    console.log(self.checkbox)
    self.checkbox = 50;
  }

self.sevenDaysWeatherCheck = function(weather){
  plantHISTORY = self.history;

  var eightdaysAgo = $window.moment().subtract(8, 'days').toObject()

  arrayoflasteightdaysHistory = [];
  _(plantHISTORY).forEach(function(item) {

    if ($window.moment(item.lastWateredPalm).isBetween(eightdaysAgo, $window.moment())){arrayoflasteightdaysHistory.push(item)};
  });

  weatherDaysOnly = [];
  _(arrayoflasteightdaysHistory).forEach(function(item) {
    if (item.lastWeatherState == weather){
      var weatherDay = $window.moment(item.lastWateredPalm).format("dddd");
      weatherDaysOnly.push(weatherDay);
   }
  });

  whichDaysWeather = _.intersection(weatherDaysOnly, ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]);
  return whichDaysWeather.length;
}



self.palmWateredDaysCheck = function(){
    console.log(self.history);
    plantHISTORY = self.history;

  var eightdaysAgo = $window.moment().subtract(8, 'days').toObject()
  arrayoflasteightdaysHistory = [];
  _(plantHISTORY).forEach(function(item) {
    
    if ($window.moment(item.lastWateredPalm).isBetween(eightdaysAgo, $window.moment())){
     var recentItem = $window.moment(item.lastWateredPalm).format("dddd");
        arrayoflasteightdaysHistory.push(recentItem);
      }
  });
 
  whichDaysWatered = _.intersection(arrayoflasteightdaysHistory, ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]);
  if (whichDaysWatered.length > 6){
    console.log("plant has been watered everyday during last 7 days");
    return whichDaysWatered.length;

  } else {console.log("plant has not been watered everyday")
    return whichDaysWatered.length;
  }
}

/*test test test*/
  self.retrieveActivity = function(message){
    console.log(message);
    self.history.push({ text: message.text, username: message.email,lastWateredPalm: message.lastWateredPalm, palmHealth: message.palmHealth, daisyHealth: message.daisyHealth, palmX: message.palmX, palmY: message.palmY, daisyX: message.daisyX,daisyY: message.daisyY, lastWeatherState: message.lastWeatherState});

    self.lastHistory = _.last(self.history);

    self.lastWateredPalm = self.lastHistory.lastWateredPalm;
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
      console.log(message);
      self.retrieveActivity(message);
      
    });
  });

  self.plantGrowthLogic = function(){

////// cloudy times in last week
var howManyTimesCloudy = self.sevenDaysWeatherCheck("cloudy");
console.log("It has been cloudy " + howManyTimesCloudy+ " days in the last 7 days")

////// sunny
var howManyTimesSunny = self.sevenDaysWeatherCheck("sunny");
console.log("It has been sunny " + howManyTimesSunny + " days in the last 7 days")

////// rainy
var howManyTimesRainy = self.sevenDaysWeatherCheck("rainy");
  console.log("It has been rainy " + howManyTimesRainy + " days in the last 7 days")


     if (self.lastWateredPalm == undefined){
        // Time
        var n = $window.moment().toObject()
        self.lastWateredPalm = n;
     } else {
       self.lastWateredPalm = self.lastWateredPalm;
     }

     var wateredHowManyDaysinLastWeek = self.palmWateredDaysCheck();
     console.log("Plant watered for " + wateredHowManyDaysinLastWeek + "days in the last week")
     console.log("new plant health minus minutes not watered : " + self.palmHealth)

     self.howManyDaysInWeek = {palmWatered:wateredHowManyDaysinLastWeek, sunny: howManyTimesSunny, rainy: howManyTimesRainy, cloudy: howManyTimesCloudy}
  }

  self.socketlogin = function() {
    socket.emit('message', { text: self.message, username: self.username});
    self.message = null;
  }

  self.sendMessage = function() {
    socket.emit('message', { text: self.message, username: self.username, lastWateredPalm: self.lastWateredPalm, palmHealth: self.palmHealth, daisyHealth: self.daisyHealth, palmX: $scope.itemLocations.palmX, palmY: $scope.itemLocations.palmY,daisyX: $scope.itemLocations.daisyX,daisyY: $scope.itemLocations.daisyY, lastWeatherState: self.lastWeatherState, history: self.history});
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
      var n = $window.moment().toObject()
      self.lastWateredPalm = n;
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
      $scope.weatherBGColor = "#444444";
    } if (currentweathercode == 5 ||currentweathercode == 6 ||currentweathercode == 7 ||currentweathercode == 8 ||currentweathercode == 10 ||currentweathercode == 13 ||currentweathercode == 14 ||currentweathercode == 15 ||currentweathercode == 16 ||currentweathercode == 17 ||currentweathercode == 18 ||currentweathercode == 46 ||currentweathercode == 41 ||currentweathercode == 42 ||currentweathercode == 43 ||currentweathercode == 35){
      $scope.snowy = true;
      self.lastWeatherState = "snowy";
     $scope.weatherBGColor = "#85DB8C";
    } if (currentweathercode == 11 ||currentweathercode == 12 ||currentweathercode == 40 || currentweathercode ==  39 || currentweathercode ==  38){
      $scope.rainy = true;
      self.lastWeatherState = "rainy";
      $scope.weatherBGColor = "#E6E6E6";
    } if(currentweathercode == 19 || currentweathercode == 20 || currentweathercode == 22 || currentweathercode == 23 || currentweathercode == 24 || currentweathercode == 26 || currentweathercode == 29){
      $scope.cloudy = true;
      self.lastWeatherState = "cloudy";
      $scope.weatherBGColor = "#2EB5E5";
    } if(currentweathercode == 27 ||currentweathercode == 29 ||currentweathercode == 31 ||currentweathercode == 33){
      $scope.starry = true;
      self.lastWeatherState = "starry";
      $scope.weatherBGColor = "#222233";
    } if(currentweathercode == 32 ||currentweathercode == 34 ||currentweathercode == 36 || currentweathercode == 28 ||currentweathercode == 30 || self.currentweathertemp > 15){
      $scope.sunny = true;
      self.lastWeatherState = "sunny";
     $scope.weatherBGColor = "#00BBFF";
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

        $scope.yahooWeatherResponse = response;

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

self.yahooObject = function(){
  console.log($scope.yahooWeatherResponse);
var Sunrise =  $scope.yahooWeatherResponse.data.query.results.channel.astronomy.sunrise
var Sunset = "8:22 pm"//$scope.yahooWeatherResponse.data.query.results.channel.astronomy.sunset
var sunriseSunset = function (astro){
// Sunrise/Sunset Calculation
  var hours = parseInt(astro.split(":")[0]);
  var minutes = parseInt(astro.split(/:| /)[1]);
  var amOrPM = (astro.split(/:| /)[2]);


  if (amOrPM = "pm"){
    hours = hours + 12;
  }

  var a = moment({hour: hours, minute: minutes});
  var b = moment();
 return a.diff(b, 'hours'); // 1 
 }
 hoursSinceSunrise = sunriseSunset(Sunrise);
 //hoursSinceSunset = sunriseSunset(Sunset);
 console.log("Its been " + hoursSinceSunrise + " hours since sunrise");

 // sunset calculation

 var timenowinhours = moment().toObject().hours
 var sunsetHours = parseInt(Sunset.split(":")[0]);
 var minutes = parseInt(Sunset.split(/:| /)[1]);
 var amOrPM = (Sunset.split(/:| /)[2]);
 if (amOrPM = "pm"){
   sunsetHours = sunsetHours + 12;
 }

 if (timenowinhours > sunsetHours){
  //bgchangecolor ="star background"
 } else {
  var timeleft = sunsetHours - timenowinhours
  console.log("its not late enough to set the sun, yet!" + timeleft + "hours to go! ")
 }

}

self.analyzeHistory = function(){
  self.history
}


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