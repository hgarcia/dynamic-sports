angular
.module('dynamic-sports', ['ionic', 'dynamic-sports.services', 'dynamic-sports.controllers'])
.config(function($stateProvider, $urlRouterProvider) {

 $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "templates/home.html",
      controller: 'HomeCtrl'
    });
    // .state('about', {
    //   url: "/about",
    //   templateUrl: "about.html",
    //   controller: 'AboutCtrl'
    // })
    // .state('contact', {
    //   url: "/contact",
    //   templateUrl: "contact.html"
    // })

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise("/home");
});