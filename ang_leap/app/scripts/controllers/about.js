'use strict';

/**
 * @ngdoc function
 * @name angLeapApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angLeapApp
 */



angular.module('angLeapApp')
  .controller('AboutCtrl', function ($scope) {
	

	// Store frame for motion functions
	var previousFrame = null;
	var paused = false;
	var pauseOnGesture = false;

	// Setup Leap loop with frame callback function
	var controllerOptions = {enableGestures: true};

	// to use HMD mode:
	// controllerOptions.optimizeHMD = true;

	$scope.frame = {};
	$scope.frame.timestamp = {};
	$scope.frame.hands = {};
	$scope.frame.fingers = {};
	$scope.frame.tools = {};
	$scope.frame.gestures = {};

	Leap.loop(controllerOptions, function(frame) {
	  	if (paused) {
	    	return; // Skip this update
	  	}

	    $scope.$apply(function () {
	    	$scope.frame.id = frame.id;
	    	$scope.frame.timestamp = frame.timestamp;
	    	$scope.frame.hands.length = frame.hands.length;
	    	$scope.frame.fingers.length = frame.fingers.length;
	    	$scope.frame.tools.length = frame.tools.length;
	    	$scope.frame.gestures.length = frame.gestures.length;
        });

	});

  });
