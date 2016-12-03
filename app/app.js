'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'myApp.config',
    'myApp.security',
    'myApp.login',
    'myApp.refrigerator',
    'ngMaterial'
  ])
  
  .config(['$routeProvider', '$mdIconProvider', function ($routeProvider, $mdIconProvider) {
    $routeProvider.otherwise({
      redirectTo: '/refrigerator'
    });
    $mdIconProvider.iconSet('core', 'bower_components/angular-material/demos/icon/demoSvgIconSets/assets/core-icons.svg')
  }])
  
  .run(['$rootScope', 'Auth', function($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);
