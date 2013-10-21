var app = angular.module('plunker', ['jonniespratley.angularWebSpeechDirective']);

var speechRecognition = function(){
  console.log('speechRecognition');
}

var speech = function() {
	if( typeof speechRecognition !== 'undefinded') {
		return new speechRecognition();
	} else if( typeof msSpeechRecognition !== 'undefined') {
		return new msSpeechRecognition();
	} else if( typeof mozSpeechRecognition !== 'undefined') {
		return new mozSpeechRecognition();
	} else if( typeof webkitSpeechRecognition !== 'undefined') {
		return new webkitSpeechRecognition();
	} else {
		
	}
	throw new Error('No speech recognition API detected!');
};



app.controller('MainCtrl', function($scope) {
  $scope.home = {
    title: 'Web Speech API Directive',
    body: 'Use your voice to do something.'
  };
  //$scope.Speech = Speech.init();
	$scope.myModel = '';
	console.log($scope);
});