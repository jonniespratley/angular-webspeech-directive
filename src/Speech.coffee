class jsSpeechFactory
	startTimestamp = null
	recognizing = false
	recording = false
	recognition = null
	ignoreEnd = null
	transcript = null
	messages =
		info_recording: 'Speak now.'
		info_no_jsSpeechFactory: 'No jsSpeechFactory was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.'
		info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that'
		info_blocked: 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream'
		info_denied: 'Permission to use microphone was denied.'
		info_start: 'Click on the microphone icon and begin speaking for as long as you like.'
		info_upgrade: 'Web jsSpeechFactory API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.'
		info_allow: 'Click the "Allow" button above to enable your microphone.'
	
	model =
		icon: null
		status: null
		message: null
		results: null
	
	elements =
		
	
	icons =
		start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.gif'
		recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-animate.gif'
		blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.gif'
	
	init: (scope) ->
		@scope = scope
		@log 'jsSpeechFactory.init()', this
		if 'webkitjsSpeechFactoryRecognition' of window
			@setup()
		else
			@showUpgrade()

		#Setup UI
		model.message = messages.info_start
		model.icon = icons.start
		#$rootScope.Speech = this
		scope
	

	onstart: (event) ->
		jsSpeechFactory.log 'jsSpeechFactory.onstart()', event

		#Listening
		jsSpeechFactory.recognizing = true

		#Show message
		jsSpeechFactory.showInfo 'info_speak_now'

		#Change icon
		jsSpeechFactory.model.icon = jsSpeechFactory.icons.recording
	

	onerror: (event) ->
		jsSpeechFactory.log 'jsSpeechFactory.onerror()', event

		if event.error is 'no-jsSpeechFactory'
			model.icon = icons.start
			showInfo 'info_no_jsSpeechFactory'
			ignoreEnd = true

		if event.error is 'audio-capture'
			model.icon = icons.start
			showInfo 'info_no_microphone'
			ignoreEnd = true

		if event.error is 'not-allowed'
			if event.timeStamp - startTimestamp < 100
				showInfo 'info_blocked'
			else
				showInfo 'info_denied'
			ignoreEnd = true
	

	onend: ->
		@log 'jsSpeechFactory.onend()'
		recognizing = false
		if ignoreEnd
		  return

		#Change icon
		model.icon = icons.start
		unless transcript
			showInfo 'info_start'
			return
		showInfo ''
	

	onresult: (event) ->
		@log 'jsSpeechFactory.onresult()', event
		recognizing = false
		interim_transcript = ''
		if typeof (event.results) is 'undefined'
			@recognition.onend = null
			@recognition.stop()
			showUpgrade()
			return
		i = event.resultIndex

		while i < event.results.length
			console.log(event.results[i][0].transcript)
			if event.results[i].isFinal
				transcript += event.results[i][0].transcript
				@stop()
			else
				transcript += event.results[i][0].transcript
			++i
		transcript = capitalize(jsSpeechFactory.transcript)
		
	

	#showButtons('inline-block');
	showInfo: (message) ->
		jsSpeechFactory.log 'jsSpeechFactory.showInfo()', this
		@message = @messages[message]
		
	

	showUpgrade: ->
		@log 'jsSpeechFactory.showUpgrade()', this
	

	#Handle setting up everything.
	setup: ->
		@log 'jsSpeechFactory.setup()', this
		#Get the instance
		@recognition = new webkitjsSpeechFactoryRecognition()

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
		@log 'jsSpeechFactory.start()'
		@showInfo 'info_recording'
		@recognizing = true
		@model.icon = @icons.recording
		@startTimestamp = new Date()
		@recognition.start()
	

	#Handle starting or stopping.
	toggle: -> 
		if @recognizing
			@stop()
		else
			@start()
	

	#Handle stopping
	stop: ->
		@log 'jsSpeechFactory.stop()'
		@recognition.stop()
		@model.icon = @icons.end
		@model.message = 
		@showInfo 'info_start'
	

	capitalize: (s) ->
		@log s
		s
	

	linebreak: (s) ->
		@log s
		s
	

	log: ->
		console.log arguments
	



j = new jsSpeechFactory()
j.init()
