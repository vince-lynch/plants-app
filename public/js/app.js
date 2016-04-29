angular
  .module("VinceLynch", ['ngResource', 'satellizer', 'angular-jwt', 'ui.router', 'rzModule','ngDraggable', 'angularMoment'])
  .constant('API_URL2', '/')
  .config(oauthConfig)
  //.config(NGRouteR); 
  .config(Router)

  /*.directive('ngDraggable', function($document) {
    return {
      restrict: 'A',
      scope: {
        dragOptions: '=ngDraggable', someCtrlFn: '&callbackFn'
      },
      link: function(scope, elem, attr) {


        var startX, startY, x = 0, y = 0,
            start, stop, drag, container;

        var width  = elem[0].offsetWidth,
            height = elem[0].offsetHeight;

        // Obtain drag options
        if (scope.dragOptions) {
          start  = scope.dragOptions.start;
          drag   = scope.dragOptions.drag;
          stop   = scope.dragOptions.stop;
          var id = scope.dragOptions.container;
          if (id) {
              container = document.getElementById(id).getBoundingClientRect();
          }
        }

        // Bind mousedown event
        elem.on('mousedown', function(e) {
          e.preventDefault();
          startX = e.clientX - elem[0].offsetLeft;
          startY = e.clientY - elem[0].offsetTop;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
          if (start) start(e);
        });

        // Handle drag event
        function mousemove(e) {
          y = e.clientY - startY;
          x = e.clientX - startX;
          setPosition();
          if (drag) drag(e);
        }

        // Unbind drag events
        function mouseup(e) {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
          if (stop) stop(e);
        }

        // Move element, within container if provided
        function setPosition() {
          if (container) {
            if (x < container.left) {
              x = container.left;
            } else if (x > container.right - width) {
              x = container.right - width;
            }
            if (y < container.top) {
              y = container.top;
            } else if (y > container.bottom - height) {
              y = container.bottom - height;
            }
          }
          console.log(y + "px ," + x + "px");

          if (x < 308){
            console.log("watering can touching plant")
            var degrees = -45;

                   elem.css('transition', '-webkit-transform 800ms ease');

                   var rotate = function() {
                      elem.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
                      degrees += 360;
                   };

                    rotate();
                
          }
          if (x == 307){
           
                    scope.someCtrlFn();
          } 

          if (x == 288){
           
                    scope.someCtrlFn();
          } 

          if (x > 309) {
            var degrees = 0;

                   elem.css('transition', '-webkit-transform 800ms ease');

                   var rotate = function() {
                      elem.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
                      degrees += 360;
                   };

                    rotate();
          }

          if (x < 182) {
            var degrees = 0;

                   elem.css('transition', '-webkit-transform 800ms ease');

                   var rotate = function() {
                      elem.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
                      degrees += 360;
                   };

                    rotate();
          }

          elem.css({
            top: y + 'px',
            left:  x + 'px'
          });
        }
      }
    }

  });*/

  .directive('ngDraggable', function($document, $window){
    function makeDraggable(scope, element, attr) {


      var startX = 0;
      var startY = 0;

      palmtree = document.getElementById("palmtree");
      var rect = palmtree.getBoundingClientRect();
      console.log(rect.top, rect.left);

      palmX = rect.left;
      palmY = rect.top;

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
    .state('login', {
      url: '/', 
      templateUrl: 'newlogin.html'
    })
    .state('plants',{
      url: '/plants',
      templateUrl: 'plants.html'
    })
    .state('about',{
      url: '/about',
      templateUrl: 'about.html'
    });

    $urlRouterProvider.otherwise('/');
}
/*Router.$inject = ['$stateProvider', '$urlRouterProvider'];
function Router($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('front', {
      url: '/', 
      templateUrl: 'new.html'
    })
    .state('login', {
      url: '/login', 
      templateUrl: 'login.html'
    });
    

    $urlRouterProvider.otherwise('/');
  
}
*/