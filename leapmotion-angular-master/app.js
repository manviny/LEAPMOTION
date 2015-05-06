/*
 * Main App Module and Controller
 * @author Kevin Blanco <mail@kevinblanco.io>
 */

var app = angular.module('leap', []);

app.controller( 'leapCtrl', function($scope, $window){

    /*
     * Variable initialization
     */
    var controller;
    $scope.messages     = [{text:'App Initialized'}];
    $scope.gestures     = [{type:'Initial Log', hands:'', pointables: '' }];
    $scope.hands        = 0;
    $scope.ready        = false;


    /*
     * Status Alert function
     * @param String theMessage : Text that will be displayed on the log
     */
    $scope.statusAlert = function(theMessage){
        $scope.messages.push({text: theMessage});
        console.log(theMessage);
        $scope.$apply();
    }


    /*
     * Update the number of hands
     * @param int handsNumber : Number of hands on an specific frame
     */
    $scope.updateHands = function( handsNumber ){

        $scope.hands = handsNumber;
        console.log(handsNumber);
        $scope.$apply();

    }


    /*
     * Update the number of Fingers
     * @param int fingersNumber : Number of fingers on an specific frame
     */
    $scope.updateFingers = function( fingersNumber ){

        $scope.fingers = fingersNumber;
        console.log(fingersNumber);
        $scope.$apply();

    }


    /*
     * Tool Using
     * @param String toolsUsed : String containing a message if a
     * tools is been used on an specific frame
     */
    $scope.toolUsing = function( toolsUsed ){

        if(toolsUsed > 0){

            $scope.tool = "Yes";

        }else{

            $scope.tool = "No";
        }

        $scope.$apply();

    }


    /*
     * Gesture Tracking
     * @param Object gesture : Object containing a gesture from a
     * specific frame.
     */
    $scope.gestureTracking = function( gesture ){

        console.log("There was a gesture");

        var gestureHands, gesturePointables, gestureType;

        for( var i = 0; i < gesture.length; i++){

            console.log(gesture[i]);

            gestureHands        = gesture[i].handIds.length;
            gesturePointables   = gesture[i].pointableIds.length;
            gestureType         = gesture[i].type;

            $scope.gestures.push({
                type        : gestureType,
                hands       : gestureHands,
                pointables  : gesturePointables
            });

            $scope.$apply();
        }


    }


    //If there's a controller defined
    if (!controller) {

        //Let's create an instance from the Leap controller.
        controller = new $window.Leap.Controller({enableGestures: true});


        //On controller connected listener bind.
        controller.on('connect', function(){

            $scope.statusAlert("Leap controller device is connected");

        });


        //On the controller ready listener bind.
        controller.on('ready', function(){

            $scope.statusAlert("Leap controller device is ready");
            $scope.ready = true;
            $scope.$apply();
        });


        //On the device Connected listener bind.
        controller.on('deviceConnected', function() {
            $scope.statusAlert(" Leap device has been connected.");
            $scope.ready = true;
            $scope.$apply();
        });


        //On the device disconnected listener bind.
        controller.on('deviceDisconnected', function() {
            $scope.statusAlert("Leap device has been disconnected.");
            $scope.ready = false;
            $scope.$apply();
        });


        //On each controller frame function bind
        controller.on('frame', function(frame) {

            $scope.updateHands(frame.hands.length);
            $scope.updateFingers(frame.fingers.length);
            $scope.toolUsing(frame.tools.length);

            if(frame.gestures.length > 0){
                $scope.gestureTracking(frame.gestures);
            }

        });

        //And then, let's connect the controller instance.
        controller.connect();

    }

});