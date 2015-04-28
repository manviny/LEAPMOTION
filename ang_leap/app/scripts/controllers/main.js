'use strict';

/**
 * @ngdoc function
 * @name angLeapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angLeapApp
 */
angular.module('angLeapApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
