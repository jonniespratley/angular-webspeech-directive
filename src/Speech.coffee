Speech =
	startTimestamp: null
	recognizing: false
	recording: false
	recognition: null
	ignoreEnd: null
	transcript: null
	messages:
		info_speak_now: 'Speak now.'
		info_no_speech: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.'
		info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that'
		info_blocked: 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream'
		info_denied: 'Permission to use microphone was denied.'
		info_start: 'Click on the microphone icon and begin speaking for as long as you like.'
		info_upgrade: 'Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.'
		info_allow: 'Click the "Allow" button above to enable your microphone.'

	model:
		icon: null
		status: null
		message: null
		results: null

	elements:
		icon: angular.element('.speech-icon')
		btn: angular.element('.speech-btn')
		container: angular.element('.speech-container')
		hint: angular.element('.speech-hint')
		status: angular.element('.speech-status')
		message: angular.element('.speech-message')

	icons:
		start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.gif'
		recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-animate.gif'
		blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.gif'

	init: ->
		@log 'Speech.init()', this
		if 'webkitSpeechRecognition' of window
			@setup()
		else
			@showUpgrade()

		#Setup UI
		@model.message = @messages.info_start
		@model.icon = @icons.start
		this

	onstart: (event) ->
		Speech.log 'Speech.onstart()', event

		#Listening
		Speech.recognizing = true

		#Show message
		Speech.showInfo 'info_speak_now'

		#Change icon
		Speech.model.icon = Speech.icons.recording

	onerror: (event) ->
		Speech.log 'Speech.onerror()', event
		if event.error is 'no-speech'
			Speech.model.icon = Speech.icons.start
			Speech.showInfo 'info_no_speech'
			Speech.ignoreEnd = true
		if event.error is 'audio-capture'
			Speech.model.icon = Speech.icons.start
			Speech.showInfo 'info_no_microphone'
			Speech.ignoreEnd = true
		if event.error is 'not-allowed'
			if event.timeStamp - Speech.startTimestamp < 100
				Speech.showInfo 'info_blocked'
			else
				Speech.showInfo 'info_denied'
			Speech.ignoreEnd = true

	onend: ->
		Speech.log 'Speech.onend()'
		Speech.recognizing = false
		if Speech.ignoreEnd
		  return

		#Change icon
		Speech.model.icon = Speech.icons.start
		unless Speech.transcript
			Speech.showInfo 'info_start'
			return
		Speech.showInfo ''

	onresult: (event) ->
		Speech.log 'Speech.onresult()', event
		Speech.recognizing = false
		interim_transcript = ''
		if typeof (event.results) is 'undefined'
			@recognition.onend = null
			@recognition.stop()
			Speech.showUpgrade()
			return
		i = event.resultIndex

		while i < event.results.length
			if event.results[i].isFinal
				Speech.transcript += event.results[i][0].transcript
			else
				interim_transcript += event.results[i][0].transcript
			++i
		Speech.transcript = Speech.capitalize(Speech.transcript)
		Speech.transcript or interim_transcript


	#showButtons('inline-block');
	showInfo: (message) ->
		@log 'Speech.showInfo()', this
		@model.message = @messages[message]

	showUpgrade: ->
		@log 'Speech.showUpgrade()', this

	#Handle setting up everything.
	setup: ->
		@log 'Speech.setup()', this

		#Get the instance
		@recognition = new webkitSpeechRecognition()

		#Continuous listening
		@recognition.continuous = true
		@recognition.interimResults = true

		#Setup event handlers
		@recognition.onstart = @onstart
		@recognition.onerror = @onerror
		@recognition.onend = @onend
		@recognition.onresult = @onresult


	#Handle starting
	start: ->
		@log 'Speech.start()'
		if @recognizing
			@recognition.stop()
			return
		
		@recognizing = true
		@startTimestamp = new Date()
		@recognition.start()


	#Handle stopping
	stop: ->
		@log 'Speech.stop()'

	capitalize: (str) ->

	linebreak: (s) ->

	log: ->
		console.log arguments
		
