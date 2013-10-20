
###
Dynamic Form Angular.js Directive
###
MainCtrl = ($scope, $http) ->

  
  recognizing = false
  recognition = new webkitSpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true

  $scope.messages =
    info_speak_now: 'Speak now.'
    info_stop: 'Proccessing your voice...'
    info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.'
    info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that'
    info_blocked: 'Permission to use microphone is blocked. To change, go to <a href="chrome://settings/contentExceptions#media-stream">chrome://settings/contentExceptions#media-stream</a>.'
    info_denied: 'Permission to use microphone was denied.'
    info_setup: 'Click on the microphone icon to enable Web Speech.'
    info_upgrade: 'Web jsSpeechFactory API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.'
    info_allow: 'Click the "Allow" button above to enable your microphone.'	

  icons =
    start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.png'
    recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic2-animate.gif'
    blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.png'
	
    
  $scope.myModel = ""
  $scope.msg = $scope.messages.info_setup
  $scope.Speech = 
    icon: icons.start
  
  #Handle start
  $scope.onstart = (event) ->
    $scope.$apply(() ->
      $scope.Speech.icon = icons.recording                  
    )
    console.log 'onstart', event
    

  #Handle error
  $scope.onerror = (event, message) ->
    console.log 'onerror', event, message
    switch event.error
      when "not-allowed"
        $scope.$apply(() ->
          $scope.msg = $scope.messages.info_blocked
        )
        
      else
        console.log event
    
  #Handle results
  $scope.onresult = (event) ->
    resultIndex = event.resultIndex
    console.log 'Handle results', event
    
    $scope.$apply(() ->
      $scope.Speech.icon = icons.recording                  
      $scope.msg = 'Speak into the mic...'
    )
    
    
    i = resultIndex
    while i < event.results.length
      result = event.results[i][0]
      trans = result.transcript
      console.log event.results[i]
      $scope.myModel = trans
      if event.results[i].isFinal
        console.log trans
        $scope.myModel = trans
       ++i
    
  
  #If its the file, set on the model
  $scope.reset = (event) ->
    console.log 'reset', event
    recognizing = false
    $scope.msg = $scope.messages.info_setup
    $scope.Speech.icon = icons.start
    #button.innerHTML = "Click to Speak"
  

  #Handle toggling
  $scope.toggleStartStop = ->
    if recognizing
      recognition.stop()
      $scope.reset()
    else
      recognition.start()
      recognizing = true
      $scope.myModel = ""
      $scope.Speech.icon = icons.blocked
      #button.innerHTML = "Click to Stop"

  $scope.reset()
  
  #Attach event listeners
  recognition.onerror = $scope.onerror
  recognition.onend = $scope.reset
  recognition.onresult = $scope.onresult
  recognition.onstart = $scope.onstart
   
App = angular.module("App", [])