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

	$scope.hand = {};
	$scope.arm = {};
	// $scope.hand.direction = {};


	Leap.loop(controllerOptions, function(frame) {
	  	if (paused) {
	    	return; // Skip this update
	  	}

	  	// Frame Data
	    $scope.$apply(function () {
	    	$scope.frame.id = frame.id;
	    	$scope.frame.timestamp = frame.timestamp;
	    	$scope.frame.hands.length = frame.hands.length;
	    	$scope.frame.fingers.length = frame.fingers.length;
	    	$scope.frame.tools.length = frame.tools.length;
	    	$scope.frame.gestures.length = frame.gestures.length;
        });

		// Frame motion factors
		if (previousFrame && previousFrame.valid) {
		    var translation = frame.translation(previousFrame);
		    var rotationAxis = frame.rotationAxis(previousFrame);
		    var rotationAngle = frame.rotationAngle(previousFrame);
		    var scaleFactor = frame.scaleFactor(previousFrame);

		    $scope.$apply(function () {
		    	$scope.frameTranslation = vectorToString(translation); //mm.
		    	$scope.frameRotationAxis = vectorToString(rotationAxis, 2); 
		    	$scope.frameRotationAngle = rotationAngle.toFixed(2); //radians.
		    	$scope.frameScaleFactor = scaleFactor.toFixed(2); 
		    });
		}

	    // HAND data
	    if (frame.hands.length > 0) {
		    for (var i = 0; i < frame.hands.length; i++) {
		      var hand = frame.hands[i];
		      $scope.hand.id = hand.id;
		      $scope.hand.type = hand.type;
		      $scope.hand.direction = vectorToString(hand.direction, 2);
		      $scope.hand.palmPosition = vectorToString(hand.palmPosition);
		      $scope.hand.grabStrength = hand.grabStrength;
		      $scope.hand.pinchStrength = hand.pinchStrength;
		      $scope.hand.confidence = hand.confidence;
		      $scope.arm.direction = vectorToString(hand.arm.direction());
		      $scope.arm.center = vectorToString(hand.arm.center());
		      $scope.arm.vector = vectorToString(hand.arm.basis[1]);





      // handString += "Confidence: " + hand.confidence + "<br />";
      // handString += "Arm direction: " + vectorToString(hand.arm.direction()) + "<br />";
      // handString += "Arm center: " + vectorToString(hand.arm.center()) + "<br />";
      // handString += "Arm up vector: " + vectorToString(hand.arm.basis[1]) + "<br />";


			// Hand motion factors
			if (previousFrame && previousFrame.valid) {
			    var translation = hand.translation(previousFrame);
			    var rotationAxis = hand.rotationAxis(previousFrame);
			    var rotationAngle = hand.rotationAngle(previousFrame);
			    var scaleFactor = hand.scaleFactor(previousFrame);

			    $scope.$apply(function () {
			    	$scope.handTranslation = vectorToString(translation); //mm.
			    	$scope.handRotationAxis = vectorToString(rotationAxis, 2); 
			    	$scope.handRotationAngle = rotationAngle.toFixed(2); //radians.
			    	$scope.handScaleFactor = scaleFactor.toFixed(2); 
			    });
			}


		    }

		}


		// Store frame for motion functions
		previousFrame = frame;
	});

	function vectorToString(vector, digits) {
	  if (typeof digits === "undefined") {
	    digits = 1;
	  }
	  return "(" + vector[0].toFixed(digits) + ", "
	             + vector[1].toFixed(digits) + ", "
	             + vector[2].toFixed(digits) + ")";
	}

  });
