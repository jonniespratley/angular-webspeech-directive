'use strict'

#Module instance
_app = angular.module('jonniespratley.angularWebSpeechDirective', [])

#Factory definition
_app.service 'jsSpeechFactory', (['$rootScope', ($rootScope) -> 
	two_line = /\n\n/g
	one_line = /\n/g
	first_char = /\S/
	jsSpeechFactory = 
		icons:
			start: 'http://goo.gl/2bfneP'
			recording: 'http://goo.gl/p2jHO9'
			blocked: 'http://goo.gl/vd4AKi'
		messages:
			info_speak_now: 'Speak now... or <a href="#" ng-click="abort()">Cancel</a>'
			info_stop: 'Proccessing your voice...'
			info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.'
			info_no_mic: 'No microphone was found. Ensure that a microphone is installed.'
			info_blocked: 'Permission to use microphone is blocked. To change, go to <a href="chrome://settings/contentExceptions#media-stream">chrome://settings/contentExceptions#media-stream</a>.'
			info_denied: 'Permission to use microphone was denied.'
			info_setup: 'Click on the microphone icon to enable Web Speech.'
			info_upgrade: 'Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome" target="_blank">Chrome</a> version 25 or later.'
			info_allow: 'Click the "Allow" button above to enable your microphone.'
		linebreak: (s) ->
			s.replace(two_line, "<p></p>").replace one_line, "<br>" 
		capitalize: (s) ->
			s.replace first_char, (m) ->
				m.toUpperCase()
		
		
])

#Directive definition
_app.directive 'jsSpeech', (['jsSpeechFactory', (jsSpeechFactory)->
	restrict: 'AE'
	replace: true
	transclude: true
	require: '^ngModel'
	scope: 
		ngModel: '='
	template: """
		<div class="jsSpeechFactory-container">
		<a href="" class="jsSpeechFactory-btn" ng-click="toggleStartStop()">
		<img ng-src="{{speech.icon}}" class="jsSpeechFactory-icon"/></a>
		<input type="text" class="form-control" ng-model="ngModel.value"/>
		<p class="text-muted jsSpeechFactory-hint" ng-bind-html-unsafe="speech.msg"></p>
		</div>
		"""
	link: (scope, element, attrs, ngModel) ->
		$scope = scope
		recognizing = false
		recognition = null
		
		#Default options
		$scope.speech = 
			msg: jsSpeechFactory.messages.info_setup
			icon: jsSpeechFactory.icons.start
			recognizing: false
		
		#Watch model for changes
		scope.$watch('ngModel', (newVal, oldVal) ->
			console.log newVal
		, true)

		#Safe apply 
		safeApply = (fn) ->
			phase = scope.$root.$$phase
			if phase is "$apply" or phase is "$digest"
				fn()	if fn and (typeof (fn) is "function")
			else
				scope.$apply fn
		
		#Set message for UI
		setMsg = (msg) -> 
			safeApply(()->
				$scope.speech.msg = jsSpeechFactory.messages[msg]
			)
		
		#Set icon for UI
		setIcon = (icon) ->
			safeApply(()->
				$scope.speech.icon = jsSpeechFactory.icons[icon]	
			)

		#Init the ui
		init = ->
			reset()
			if 'webkitSpeechRecognition' of window
				recognition = new webkitSpeechRecognition()
				recognition.continuous = true
				recognition.interimResults = true
			
				#Attach event listeners
				recognition.onerror = onerror
				recognition.onend = reset
				recognition.onresult = onresult
				recognition.onstart = onstart
			else
				recognition = {}
				upgrade()
		
		
		#Show error message and change icon
		upgrade = ->
			setMsg 'info_upgrade'
			setIcon 'blocked'
	
	
		#Handle start
		onstart = (event) ->
			setIcon 'recording'
			console.log 'onstart', event
			
	
		#Handle error
		onerror = (event, message) ->
			console.log 'onerror', event, message
			switch event.error
				when "not-allowed"
					setMsg 'info_blocked'
				else
					console.log event
			setMsg 'info_denied'
		
		#Handle results
		onresult = (event) ->
			setIcon 'recording'
			setMsg 'info_speak_now'
			resultIndex = event.resultIndex
			trans = ''
			i = resultIndex
			while i < event.results.length
				result = event.results[i][0]
				trans = jsSpeechFactory.capitalize(result.transcript)
				safeApply(()->
						$scope.ngModel.interimResults = trans
				)
				if event.results[i].isFinal
					safeApply(()->
						$scope.ngModel.value = trans 
					)
				++i
			
		
	
		#If its the file, set on the model
		reset = (event) ->
			console.log 'reset', event
			$scope.speech.recognizing = false
			setIcon 'start'
			setMsg 'info_setup'
	
		# Let the user abort.
		$scope.abort = () ->
			$scope.toggleStartStop()
		
	
		#Handle toggling
		$scope.toggleStartStop = ->
			if $scope.speech.recognizing
				recognition.stop()
				reset()
			else
				recognition.start()
				$scope.speech.recognizing = true
				setIcon 'blocked'

		
	#Startit
	init()
		
])
