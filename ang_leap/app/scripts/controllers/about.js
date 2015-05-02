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

	$scope.sensibilidadSentidoX = 4;
	$scope.sensibilidadSentidoY = 4;
	$scope.sensibilidadSentidoZ = 4;
	$scope.sensibilidadAccion = 70;
	$scope.veces = 0;

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
	$scope.gesture = {};

	$scope.direccion = {};

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

		    	$scope.pellizco = hand.pinchStrength==1 ? 'pellizco' :  '';
		    	$scope.agarrar = hand.grabStrength==1 ? 'agarrar' :  '';

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

				// if(hand.grabStrength==1 && hand.type=='left') alert("izquierda")
				// if(hand.grabStrength==1 && hand.type=='right') alert("derecha")

				// Hand motion factors
				if (previousFrame && previousFrame.valid) {
				    var translation = hand.translation(previousFrame);
				    var rotationAxis = hand.rotationAxis(previousFrame);
				    var rotationAngle = hand.rotationAngle(previousFrame);
				    var scaleFactor = hand.scaleFactor(previousFrame);
				    
				     $scope.$apply(function () {
				     	if(hand.palmPosition[0]>$scope.sensibilidadAccion) $scope.accionX = "derecha"
				     	if(hand.palmPosition[0]<-$scope.sensibilidadAccion) $scope.accionX = "izquierda"

			

			        	if(translation[0] < -$scope.sensibilidadSentidoX) { 
			        		if($scope.frameAnterior=='izquierda') {$scope.veces++;} 
			        		else {$scope.veces=0};
			        		$scope.direccion = {'sentido':'izquierda'} ; 
			        	} 
			        	else if (translation[0] > $scope.sensibilidadSentidoX){ 
			        		if($scope.frameAnterior=='derecha') {$scope.veces++;} 
			        		else {$scope.veces=0};
			        		$scope.direccion = {'sentido':'derecha'} ; 
			        	}
			        	if(translation[1] < -$scope.sensibilidadSentidoZ) { 
			        		if($scope.frameAnterior=='abajo') {$scope.veces++;} 
			        		else {$scope.veces=0};
			        		$scope.direccion = {'sentido':'abajo'} ; 
			        	} 
			        	else if (translation[1] > $scope.sensibilidadSentidoZ){ 
			        		if($scope.frameAnterior=='arriba') {$scope.veces++;} 
			        		else {$scope.veces=0};
			        		$scope.direccion = {'sentido':'arriba'} ; 
			        	}
			        	if(translation[2] < -$scope.sensibilidadSentidoY) { 
			        		if($scope.frameAnterior=='adelante') {$scope.veces++;} 
			        		else {$scope.veces=0};
			        		$scope.direccion = {'sentido':'adelante'} ; 
			        	} 
			        	else if (translation[2] > $scope.sensibilidadSentidoY){ 
			        		if($scope.frameAnterior=='atras') {$scope.veces++;} 
			        		else {$scope.veces=0};
			        		$scope.direccion = {'sentido':'atras'} ; 
			        	}
				     	
				     	console.log($scope.direccion.sentido);

				     	// 1 segundo
				     	var tiempo = $scope.frame.timestamp - $scope.timeAnterior;
				     	if(tiempo > 1000000) {
				     		console.debug("preparado",tiempo); 
				     		$scope.preparado=true
				     	}

				     	
				     	// graba frame anterior
				     	$scope.timeAnterior = $scope.frame.timestamp;
				     	$scope.frameAnterior = $scope.direccion.sentido;

				     });
				    $scope.$apply(function () {
				    	$scope.handTranslation = vectorToString(translation); //mm.
				    	$scope.handRotationAxis = vectorToString(rotationAxis, 2); 
				    	$scope.handRotationAngle = rotationAngle.toFixed(2); //radians.
				    	$scope.handScaleFactor = scaleFactor.toFixed(2); 
				    });
				}
		    }
		}


		// Display Gesture object data

		var gestureString = "";
		if (frame.gestures.length > 0) {

			if (pauseOnGesture) { togglePause(); }

			for (var i = 0; i < frame.gestures.length; i++) {
			  var gesture = frame.gestures[i];
				
			  switch (gesture.type) {
			    case "circle":

			      gestureString += "center: " + vectorToString(gesture.center) + " mm, "
			                    + "normal: " + vectorToString(gesture.normal, 2) + ", "
			                    + "radius: " + gesture.radius.toFixed(1) + " mm, "
			                    + "progress: " + gesture.progress.toFixed(2) + " rotations";
			      break;
			    case "swipe":
			    	$scope.movimiento = 'swipe ' + $scope.direccion.sentido;
			      gestureString += "start position: " + vectorToString(gesture.startPosition) + " mm, "
			                    + "current position: " + vectorToString(gesture.position) + " mm, "
			                    + "direction: " + vectorToString(gesture.direction, 1) + ", "
			                    + "speed: " + gesture.speed.toFixed(1) + " mm/s";
			      break;
			    case "screenTap":
			    case "keyTap":
			      gestureString += "position: " + vectorToString(gesture.position) + " mm";
			      break;
			    default:
			      gestureString += "unkown gesture type";
			  }
			  gestureString += "<br />";
				$scope.$apply(function () {
			  		$scope.gesture.id = gesture.id;
			  		$scope.gesture.type = gesture.type;
			  		$scope.gesture.state = gesture.state;
			  		$scope.gesture.handIds = gesture.handIds.join(", ");
			  		$scope.gesture.pointableIds = gesture.pointableIds.join(", ");
			  		$scope.gesture.duration = gesture.duration+  " &micro;s, ";
			  		$scope.gestureInfo = gestureString;
				});

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
