'use strict'

#Module instance
_app = angular.module('jonniespratley.angularWebSpeechDirective', [])

#Factory definition
_app.service 'jsSpeechFactory', (['$rootScope', ($rootScope) -> 
	jsSpeechFactory = 
		icons:
			start: 'http://goo.gl/dBS39a'
			recording: 'http://goo.gl/7JLqdm'
			blocked: 'http://goo.gl/j8MZhD'
		messages:
			 info_speak_now: 'Speak now.'
				info_stop: 'Proccessing your voice...'
				info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.'
				info_no_mic: 'No microphone was found. Ensure that a microphone is installed.'
				info_blocked: 'Permission to use microphone is blocked. To change, go to <a href="chrome://settings/contentExceptions#media-stream">chrome://settings/contentExceptions#media-stream</a>.'
				info_denied: 'Permission to use microphone was denied.'
				info_setup: 'Click on the microphone icon to enable Web Speech.'
				info_upgrade: 'Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.'
				info_allow: 'Click the "Allow" button above to enable your microphone.'
])

#Directive definition
_app.directive 'jsSpeech', (['jsSpeechFactory', (jsSpeechFactory)->
	restrict: 'EAC'
	scope: true
	replace:true
	transclude: true
	require: '^ngModel'
	template: '' +
			'<div class="jsSpeechFactory-container">' +
			'<p ng-bind-html-unsafe="msg"></p>' +
			'<a href="" class="jsSpeechFactory-btn" ng-click="toggleStartStop()">' +
			'<img ng-src="{{icon}}" class="jsSpeechFactory-icon"/></a>' +
			'<textarea rows="4" class="form-control" ng-model="ngModel"></textarea>' +
			'</div>'
	link: (scope, lElement, lAttrs, ngModel) ->
		$scope = scope
		$scope.recognizing = false
		recognition = new webkitSpeechRecognition()
		recognition.continuous = true
		recognition.interimResults = true
    
    #$scope.ngModel = ""
		$scope.msg = jsSpeechFactory.messages.info_setup
		$scope.icon = jsSpeechFactory.icons.start
		
		#Handle start
		$scope.onstart = (event) ->
			$scope.$apply(() ->
				$scope.icon = jsSpeechFactory.icons.recording
			)
			console.log 'onstart', event
			
	
		#Handle error
		$scope.onerror = (event, message) ->
			console.log 'onerror', event, message
			switch event.error
				when "not-allowed"
					$scope.$apply(() ->
						$scope.msg = jsSpeechFactory.messages.info_blocked
					)
					
				else
					console.log event
			
		#Handle results
		$scope.onresult = (event) ->
			resultIndex = event.resultIndex
			console.log 'Handle results', event
			
			$scope.$apply(() ->
				$scope.icon = jsSpeechFactory.icons.recording
				$scope.msg = 'Speak into the mic...'
			)
			
			i = resultIndex
			while i < event.results.length
				result = event.results[i][0]
				trans = result.transcript
				$scope.ngModel = trans
				if event.results[i].isFinal
					console.log trans
					$scope.ngModel = trans
				++i
			
		
		#If its the file, set on the model
		$scope.reset = (event) ->
			console.log 'reset', event
			$scope.recognizing = false
			$scope.icon = jsSpeechFactory.icons.start
			$scope.msg = jsSpeechFactory.messages.info_setup
	
		#Handle toggling
		$scope.toggleStartStop = ->
			if recognizing
				recognition.stop()
				$scope.reset()
			else
				recognition.start()
				$scope.recognizing = true
				$scope.ngModel = ""
				$scope.icon = jsSpeechFactory.icons.blocked
		
		#Attach event listeners
		recognition.onerror = $scope.onerror
		recognition.onend = $scope.reset
		recognition.onresult = $scope.onresult
		recognition.onstart = $scope.onstart
			
		$scope.reset()
])
