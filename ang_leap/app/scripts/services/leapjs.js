'use strict';

/**
 * @ngdoc service
 * @name angLeapApp.leapjs
 * @description
 * # leapjs
 * Factory in the angLeapApp.
 */
angular.module('angLeapApp')
  .factory('leapjs', function () {

    // Store frame for motion functions
    var previousFrame = null;
    var paused = false;
    var pauseOnGesture = false;

    // Setup Leap loop with frame callback function
    var controllerOptions = {enableGestures: true};

    // to use HMD mode:
    // controllerOptions.optimizeHMD = true;

    Leap.loop(controllerOptions, function(frame) {
      if (paused) {
        return; // Skip this update
      }

      $scope.frameString = "Frame ID: " + frame.id  + "<br />"
                      + "Timestamp: " + frame.timestamp + " &micro;s<br />"
                      + "Hands: " + frame.hands.length + "<br />"
                      + "Fingers: " + frame.fingers.length + "<br />"
                      + "Tools: " + frame.tools.length + "<br />"
                      + "Gestures: " + frame.gestures.length + "<br />";

    });


  var S3getFolder = function(bucket, path){


        var deferred = $q.defer(); 
       // DreamFactory.api.S3.getContainer({container:'lamemoriagrafica/lallosaderanes/imagenes/Els+banys'},
       DreamFactory.api.S3.getFolder({
        container: bucket,
        folder_path: path
       },
       // Success function
        function(result) { deferred.resolve(result.file); },
       // Error function
       function(reject) { deferred.reject(reject) }); 

       return deferred.promise; 
  }


    // Public API here

    return {
        S3getFolder: S3getFolder              
    };  


  });
