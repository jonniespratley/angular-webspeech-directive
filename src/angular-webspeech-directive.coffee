'use strict'
_app = angular.module('jonniespratley.angularWebSpeechDirective', [])

_app.factory 'jsSpeechFactory', (['$rootScope', ($rootScope) -> 
	window.jsSpeechFactory = jsSpeechFactory = 
		startTimestamp: null
		recognizing: false
		recording: false
		recognition: null
		ignoreEnd: null
		transcript: null
		messages:
			info_recording: 'Speak now.'
			info_no_jsSpeechFactory: 'No jsSpeechFactory was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.'
			info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that'
			info_blocked: 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream'
			info_denied: 'Permission to use microphone was denied.'
			info_start: 'Click on the microphone icon and begin speaking for as long as you like.'
			info_upgrade: 'Web jsSpeechFactory API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.'
			info_allow: 'Click the "Allow" button above to enable your microphone.'
		
		model:
			icon: null
			status: null
			message: null
			results: null
		
		elements:
			icon: angular.element('.jsSpeechFactory-icon')
			btn: angular.element('.jsSpeechFactory-btn')
			container: angular.element('.jsSpeechFactory-container')
			hint: angular.element('.jsSpeechFactory-hint')
			status: angular.element('.jsSpeechFactory-status')
			message: angular.element('.jsSpeechFactory-message')
		
		icons:
			start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.gif'
			recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-animate.gif'
			blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.gif'
		
		init: (scope)->
			@scope = scope
			@log 'jsSpeechFactory.init()', this
			if 'webkitSpeechRecognition' of window
				@setup()
			else
				@showUpgrade()

			#Setup UI
			@model.message = @messages.info_start
			@changeIcon('start')
			scope.Speech = this
		

		showUpgrade: ->
			@log 'jsSpeechFactory.showUpgrade()', this
		
		#Handle setting up everything.
		setup: ->
			@log 'jsSpeechFactory.setup()', this

			#Get the instance
			@recognition = new webkitSpeechRecognition()

			#Continuous listening
			@recognition.continuous = true
			@recognition.interimResults = true
			@changeIcon('blocked')

			#Setup event handlers
			@recognition.onstart = @onstart
			@recognition.onerror = @onerror
			@recognition.onend = @onend
			@recognition.onresult = @onresult
		
		#Handle starting
		start: ->
			@log 'jsSpeechFactory.start()'
			@showInfo 'info_recording'
			@recognizing = true
			#@model.icon = @icons.recording
			@startTimestamp = new Date()
			@recognition.start()
		
		#Handle starting or stopping.
		toggle: -> 
			if @recognizing
				jsSpeechFactory.stop()
			else
				jsSpeechFactory.start()
		
	
		changeIcon: (what) ->
			@model.icon = @icons[what]
		
		#Handle stopping
		stop: ->
			@log 'jsSpeechFactory.stop()'
			@recognition.stop()
			@model.message = 'Stopped'
			@showInfo 'info_start'
		
		onstart: (event) ->
			jsSpeechFactory.log 'jsSpeechFactory.onstart()', event

			#Listening
			jsSpeechFactory.recognizing = true

			#Show message
			jsSpeechFactory.showInfo 'info_speak_now'

			#Change icon
			jsSpeechFactory.changeIcon('recording')
		

		onerror: (event) ->
			console.log 'jsSpeechFactory.onerror()', event

			if event.error is 'no-speech'
				jsSpeechFactory.model.icon = jsSpeechFactory.icons.start
				jsSpeechFactory.showInfo 'info_no_jsSpeechFactory'
				jsSpeechFactory.ignoreEnd = true

			if event.error is 'audio-capture'
				jsSpeechFactory.model.icon = jsSpeechFactory.icons.start
				jsSpeechFactory.showInfo 'info_no_microphone'
				jsSpeechFactory.ignoreEnd = true

			if event.error is 'not-allowed'
				if event.timeStamp - jsSpeechFactory.startTimestamp < 100
					jsSpeechFactory.showInfo 'info_blocked'
				else
					jsSpeechFactory.showInfo 'info_denied'
				jsSpeechFactory.ignoreEnd = true
		

		onend: ->
			console.log 'jsSpeechFactory.onend()'
			jsSpeechFactory.recognizing = false
			if jsSpeechFactory.ignoreEnd
			  return

			#Change icon
			jsSpeechFactory.model.icon = jsSpeechFactory.icons.start
			unless jsSpeechFactory.transcript
				jsSpeechFactory.showInfo 'info_start'
				return
			jsSpeechFactory.showInfo ''
		

		onresult: (event) ->
			jsSpeechFactory.log 'jsSpeechFactory.onresult()', event
			jsSpeechFactory.recognizing = false
			interim_transcript = ''
			if typeof (event.results) is 'undefined'
				@recognition.onend = null
				@recognition.stop()
				jsSpeechFactory.showUpgrade()
				return
			i = event.resultIndex

			while i < event.results.length
				trans = event.results[i][0].transcript
				
				jsSpeechFactory.model.result += trans
				
				
				#log
				console.log(trans)
				
				
				if event.results[i].isFinal
					jsSpeechFactory.transcript += event.results[i][0].transcript
					jsSpeechFactory.stop()
				else
					jsSpeechFactory.transcript += event.results[i][0].transcript
				++i
			jsSpeechFactory.transcript = jsSpeechFactory.capitalize(jsSpeechFactory.transcript)
			
		

		#showButtons('inline-block');
		showInfo: (message) ->
			jsSpeechFactory.log 'jsSpeechFactory.showInfo()', this
			@message = @messages[message]
			
		
		capitalize: (s) ->
			@log s
		
	
		linebreak: (s) ->
			@log s
		
		log: =>
			console.log arguments
	
])

_app.directive 'jsSpeech', (['jsSpeechFactory', (jsSpeechFactory)->
	restrict: 'EAC'
	scope: true
	replace:true
	transclude: true
	templateUrl: '../src/tmpl.html'
	link: (scope, lElement, lAttrs, transclude) ->
		scope.Speech = jsSpeechFactory.init(scope)
		
		#scope.Speech.start = jsSpeechFactory.start();
		
		console.log 'jsSpeechFactory', jsSpeechFactory, scope
	
])