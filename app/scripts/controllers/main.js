'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($scope, googleAuth) {
    // Prepare google datas
    $scope.google = {
      googleId: null,
      avatar: null,
      email: null,
      familyName: null,
      givenName: null
    };

    // When Angular is ready ... 
    angular.element(document).ready(function () {  
      // Start googleAuth flow
      googleAuth.handleClientLoad();

      // Listen userDatasReady event.
      // He will be fired after Google+ and Gmail APIs returns datas.
      window.addEventListener('userDatasReady', function (e) {
        console.log('User datas event fired !');

        // Add google user data in scope
        $scope.$apply(function() {
          $scope.google.googleId    = googleAuth.googleId;
          $scope.google.avatar      = googleAuth.avatar;
          $scope.google.email       = googleAuth.email;
          $scope.google.familyName  = googleAuth.familyName;
          $scope.google.givenName   = googleAuth.givenName;
        });
      }, false);
    });
  });
