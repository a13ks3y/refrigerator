(function (angular) {
    "use strict"

    var app = angular.module('myApp.refrigerator', ['ngRoute', 'firebase.utils', 'firebase']);

    app.controller('RefrigeratorCtrl', [
        '$scope',
        '$location',
        '$firebaseArray',
        '$mdDialog',
        'Auth',
        'user',
        'fbutil',
    function ($scope, $location, $firebaseArray, $mdDialog, Auth, user, fbutil) {
        console.log(user);
        var itemsRef = fbutil.ref('users/' + user.uid + '/items');

        $scope.newItemTitle = '';
        $scope.items = $firebaseArray(itemsRef);
        $scope.addItem = function () {
            if ($scope.newItemTitle && $scope.newItemTitle.length) {
                $scope.items.$add({
                    title: $scope.newItemTitle,
                    hasEnded: false,
                    hasEndedTimes: 0
                });
                $scope.newItemTitle = '';
            } else {
                //todo show validation message
            }
        };

        $scope.removeItem = function (ev, item) {
            var confirm = $mdDialog.confirm()
                .title('Please confirm')
                .textContent(['Would you like to delete', item.title, '?'].join(' '))
                .targetEvent(ev)
                .ok('ok')
                .cancel('cancel');
            $mdDialog.show(confirm).then(function() {
                $scope.items.$remove(item);
            });
        };

        $scope.saveItem = function (item) {
            if (item.hasEnded) {
                // increase counter for "smart" sort
                item.hasEndedTimes = (item.hasEndedTimes || 0) + 1;
            }
            $scope.items.$save(item);
        };

        $scope.logout = function() {
            Auth.$unauth();
            $location.path('/login');
        };
    }]);



    app.config(['$routeProvider', function($routeProvider) {
       $routeProvider.whenAuthenticated('/refrigerator', {
           templateUrl: 'refrigerator/refrigerator.html',
           controller: 'RefrigeratorCtrl',
           resolve: {
               // forces the page to wait for this promise to resolve before controller is loaded
               // the controller can then inject `user` as a dependency. This could also be done
               // in the controller, but this makes things cleaner (controller doesn't need to worry
               // about auth status or timing of accessing data or displaying elements)
               user: ['Auth', function (Auth) {
                   return Auth.$waitForAuth();
               }]
           }
       });
    }]);

}(angular));