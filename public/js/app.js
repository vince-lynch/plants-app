angular
  .module("VinceLynch", ['ngResource', 'satellizer', 'angular-jwt', 'ui.router', 'rzModule','ngDraggable', 'angularMoment'])
  .constant('API_URL2', '/')
  .config(oauthConfig)
  //.config(NGRouteR); 
  .config(Router)


  .directive('ngDraggable', function($document, $window){
    function makeDraggable(scope, element, attr) {


      var startX = 0;
      var startY = 0;

      palmtree = document.getElementById("palmtree");
      var rect = palmtree.getBoundingClientRect();
      console.log(rect.top, rect.left);

      palmX = rect.left;
      palmY = rect.top;

      daisy = document.getElementById("daisy");
      var rect = daisy.getBoundingClientRect();
      console.log(rect.top, rect.left);

      daisyX = rect.left;
      daisyY = rect.top;

      wateringcan = document.getElementById("wateringcan");
      var rect = palmtree.getBoundingClientRect();
      console.log(rect.top, rect.left);

      wateringcanX = rect.left;
      wateringcanY = rect.top;

      // Start with a random pos
      var x = Math.floor((Math.random() * 500) + 40);
      var y = Math.floor((Math.random() * 360) + 40);

      element.css({
        position: 'absolute',
        cursor: 'pointer',
        top: y + 'px',
        left: x + 'px'
      });

      element.on('mousedown', function(event) {
        console.log(this.getAttribute("name"));
        currentlyDraggedItem = this.getAttribute("name");

        event.preventDefault();
        
        startX = event.pageX - x;
        startY = event.pageY - y;

        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;

      if (currentlyDraggedItem == "wateringcan"){
          wateringcanX = x;
          wateringcanY = y;
       

        if (wateringcanX < (palmX + 55) && wateringcanX > palmX){
            console.log("wateringcan touching palm")
            $window.currentlyBeingWatered = "palm";
            var degrees = -45;

                   element.css('transition', '-webkit-transform 800ms ease');

                   var rotate = function() {
                      element.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
                      degrees += 360;
                   };

                    rotate();
                    scope.someCtrlFn();
          } else if (wateringcanX < (daisyX + 100) && wateringcanX > daisyX){
            console.log("wateringcan touching daisy")
            $window.currentlyBeingWatered = "daisy";
            var degrees = -45;

                   element.css('transition', '-webkit-transform 800ms ease');

                   var rotate = function() {
                      element.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
                      degrees += 360;
                   };

                    rotate();
                    scope.someCtrlFn();
          } else {
            var degrees = 0;

                   element.css('transition', '-webkit-transform 800ms ease');

                   var rotate = function() {
                      element.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
                      degrees += 360;
                   };

                    rotate();
          }
        }

        element.css({
          top: y + 'px',
          left: x + 'px'
        });
      }

      function mouseup() {
        console.log(currentlyDraggedItem + "has been left at " + x + "x axis and " + y + "y axis" )

        if (currentlyDraggedItem == "daisy"){
          daisyX = x;
          daisyY = y;
          console.log("currently dragged item was daisy, and values " + daisyX + daisyY + "have been stored")
          $window.daisyX = daisyX;
          $window.daisyY = daisyY;
          scope.someCtrlFn();
        }

        if (currentlyDraggedItem == "palm"){
          palmX = x;
          palmY = y;
          console.log("currently dragged item was palm, and values " + palmX + palmY + "have been stored")
         $window.palmX = palmX;
         $window.palmY = palmY;
         scope.someCtrlFn();
        }

        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
    }
    return {
      scope: {
         someCtrlFn: '&callbackFn',
      },
      link: makeDraggable
    };
  });
  

  oauthConfig.$inject = ['$authProvider', 'FACEBOOK_API_KEY', 'GITHUB_API_KEY', 'INSTAGRAM_API_KEY', 'API_URL2'];
  function oauthConfig($authProvider, FACEBOOK_API_KEY, GITHUB_API_KEY, INSTAGRAM_API_KEY, API_URL2){
    $authProvider.facebook({
      url: '/auth/facebook', // this is the place we are telling Satilette to tell facebook to send back its post request to.
      clientId: FACEBOOK_API_KEY
    });

    $authProvider.github({
      url: '/auth/github',
      clientId: GITHUB_API_KEY
    });

    $authProvider.instagram({
        url: '/auth/instagram',
       clientId: INSTAGRAM_API_KEY
     });

    $authProvider.httpInterceptor = function(config) {
        return !!config.url.match(API_URL2);
      };

    $authProvider.tokenPrefix = null;

}

Router.$inject = ['$stateProvider', '$urlRouterProvider'];
function Router($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: '/', 
      templateUrl: 'sockets.html'
    })
    .state('plants',{
      url: '/plants',
      templateUrl: 'plants.html'
    })
    .state('sockets',{
      url: '/sockets',
      templateUrl: 'sockets.html'
    });

    $urlRouterProvider.otherwise('/');
}
