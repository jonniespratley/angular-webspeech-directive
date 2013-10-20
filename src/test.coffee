class Speech
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
		icon: '.jsSpeechFactory-icon'
		btn: '.jsSpeechFactory-btn'
		container: '.jsSpeechFactory-container'
		hint: '.jsSpeechFactory-hint'
		status: '.jsSpeechFactory-status'
		message: '.jsSpeechFactory-message'

	icons =
		start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.gif'
		recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-animate.gif'
		blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.gif'
	
	
	constructor: () ->
		@model.message = @messages.info_start
	
