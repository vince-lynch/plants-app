angular.module('VinceLynch')
.controller('SVImageController', SVImageController);

SVImageController.$inject = ['$scope', '$window', '$http'];
function SVImageController($scope, $window, $http) {

self = this;
self.currentHouseSelection = {};
self.wanthidden = false;

self.createMarkers = function(){
  console.log("Markers from DB Function called")
  $http({
    method: 'GET',
    url: 'http://localhost:8000/api/properties'
  }).then(function successCallback(response) {
      self.houses = response.data;
      console.log(self.houses);

 console.log(self.houses.length);

 var i = 0; 
 var markers = [];
 while (i < self.houses.length) {
  markers[i] = new google.maps.Marker({
      position: {lat: self.houses[i].latitude, lng: self.houses[i].longitude},
      map: map,
      title: 'Hello World!',
      icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|FFFF00',
      description: (self.houses[i].adId).toString(),
      id: i
    });
  var infowindow = new google.maps.InfoWindow({
      content: (self.houses[i].adId).toString()
  });

  
  google.maps.event.addListener(markers[i], 'click', function () {
      infowindow.open(map, markers[this.id])

      var adID = (self.houses[this.id].adId).toString()

    $http({
      method: 'GET',
      url: 'http://localhost:8000/api/idealIndivAd/' + adID
    }).then(function successCallback(response) {

     self.currentHouseSelection = response; 
     console.log(self.currentHouseSelection)

      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

  })
  i++
 }
 var i = 0; 
 var markers = [];
 while (i < self.houses.length) {
  markers[i] = new google.maps.Marker({
      position: {lat: self.houses[i].latitude, lng: self.houses[i].longitude},
      map: panorama,
      title: 'Hello World!',
      icon: '/images/salesign.png',
      description: (self.houses[i].adId).toString(),
      id: i
    });
  var infowindow = new google.maps.InfoWindow({
      content: (self.houses[i].adId).toString()
  });

  
  google.maps.event.addListener(markers[i], 'click', function () {
      infowindow.open(panorama, markers[this.id])
      alert(markers[this.id].description)
  })
  i++
 }
}, function errorCallback(response) {
 console.log(response);
});
}




this.getCurrentPosition = function() {
   
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      function success(pos) {
        crd = pos.coords;
        $scope.location = crd.latitude + "," + crd.longitude;
        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        console.log('More or less ' + crd.accuracy + ' meters.');

        $scope.refreshAllMaps() // reload streetview etc
      };

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      };

      $window.navigator.geolocation.getCurrentPosition(success, error, options);
   } 

self.getCurrentPosition()



    var geocodeDelayTO = null;

    $scope.location = "42.345573,-71.098326";
    $scope.heading = 34;
    $scope.pitch = 10;
    $scope.fov = 90; 
    $scope.src = "http://maps.googleapis.com/maps/api/streetview?size=500x300&location=&fov=90";
  
  $scope.clearAll = function () {
    $scope.location = crd.latitude + "," + crd.longitude;
    $scope.heading = 0;
    $scope.pitch = 0;
    $scope.fov = 90;
    self.getCurrentPosition()
  };
  
    $scope.updateSrc = function() {
      var data = [
        "http://maps.googleapis.com/maps/api/streetview?size=500x300",
        "location=" + $scope.location
      ];

      if ($scope.heading) {
        data.push("heading=" + $scope.heading);
      }

      if ($scope.pitch) {
        data.push("pitch=" + $scope.pitch);
      }

      if ($scope.fov < 90) {
        data.push("fov=" + $scope.fov);
      }
      $scope.src = data.join("&");
    };

    $scope.refreshAllMaps = function() {
      $scope.updateSrc();

      var latLongReg = /^\-?\d*\.?\d+\,\-?\d*\.?\d+$/,
 
    newval = crd.longitude ? crd.latitude + "," + crd.longitude : $scope.location;

      if (latLongReg.test(newval)) {
        var ll = newval.split(","),
          lat = parseFloat(ll[0]),
          lng = parseFloat(ll[1]);
        updateMap({
          lat: lat,
          lng: lng
        });
      } else {
        //geocoding time.
        if (geocodeDelayTO !== null) {
          window.clearTimeout(geocodeDelayTO);
          geocodeDelayTO = null;
        }

        if (newval) {
          geocodeDelayTO = window.setTimeout(function() {
            console.log("delayed...", newval);

            geocoder.geocode({
              address: newval
            }, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                updateMap(results[0].geometry.location);
              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            });
          }, 1000);
        }
      }

    };

    // load google maps and Street view
    var fenway = {
      lat: 42.345573,
      lng: -71.098326
    };
    map = new google.maps.Map(document.getElementById('map'), {
      center: fenway,
      zoom: 14
    });

    panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: fenway,
        mode : 'webgl',
        pov: {
          heading: 34,
          pitch: 0
        }
      });

    map.setStreetView(panorama);
    var geocoder = new google.maps.Geocoder();

    // function to update map and panorama
    function updateMap(coords) {
    console.log("coordinates: ", coords);
      map.setCenter(coords);
      panorama.setPosition(coords);
    };

    // as panorama is moved around, update coordinates in location
    panorama.addListener("position_changed", function() {
      var pos = panorama.getPosition();
      var latLongString = [pos.lat(), pos.lng()].join(",");
      if (latLongString !== $scope.location) {
        $scope.$apply(function() {
          $scope.location = latLongString;
        });
      }

    });

    // as panorama pov changes, update heading and pitch
    panorama.addListener("pov_changed", function() {
      var pov = panorama.getPov();
      if (pov.heading !== $scope.heading || pov.pitch !== $scope.pitch) {
        $scope.$apply(function() {
          $scope.heading = pov.heading;
          $scope.pitch = pov.pitch;
        });
      }
    });


    self.createMarkers();
  }



