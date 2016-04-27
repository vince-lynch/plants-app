angular
  .module("VinceLynch", ['ngResource', 'satellizer', 'angular-jwt', 'ui.router', 'rzModule','ngDraggable'])
  .constant('API_URL2', '/')
  .config(oauthConfig)
  //.config(NGRouteR); 
  .config(Router)

  .directive('ngDraggable', function($document) {
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
    .state('front', {
      url: '/', 
      templateUrl: 'new.html'
    });
    

    $urlRouterProvider.otherwise('/');
  
}
