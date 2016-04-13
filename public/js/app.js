angular
  .module("VinceLynch", ['ngResource', 'satellizer', 'angular-jwt', 'ui.router', 'rzModule'])
  .constant('API_URL2', '/')
  .config(oauthConfig)
  //.config(NGRouteR); 
  .config(Router);


  

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
      templateUrl: 'front.html'
    })
    .state('gifmaker',{
      url: '/gifmaker',
      templateUrl: 'gifmaker.html'
    })
    .state('instacity',{
      url: '/instacity',
      templateUrl: 'instacity.html'
    })
    .state('city', {
      url: '/place/:city/:country',
      templateUrl: 'city.html'
    })
    .state('results', {
      url: '/results/',
      templateUrl: 'results.html'
    });
    

    $urlRouterProvider.otherwise('/');
  
}
