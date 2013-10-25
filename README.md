[min]: https://raw.github.com/jonniespratley/jquery-angular-webspeech-directive/master/dist/angular-angular-webspeech-directive.min.js
[max]: https://raw.github.com/jonniespratley/jquery-angular-webspeech-directive/master/dist/angular-angular-webspeech-directive.js

# HTML5 Web Speech AngularJS Directive
AngularJS is one of the hottest JavaScript frameworks on the internet providing a full stack for creating single page applications (SPAs).

Angular Directives are a way to teach HTML new tricks. During DOM compilation directives are matched against the HTML and executed. This allows directives to register behavior, or transform the DOM. 
 
The Web Speech API provides an alternative input method for web applications *(without using a keyboard)*. Developers can give web applications the ability to transcribe voice to text, from the computer's microphone. 

 
![image](http://goo.gl/oYiKJ4)

## * Tutorial 
To quickly get started creating a custom component for AngularJS, install the [AngularJS Component Generator](https://github.com/mgcrea/generator-angular-component), execute the following command:

	$ sudo npm install -g generator-angular-component
	
Now you'll be able to scaffold a angular component project.


### Step 1 - Create the project
Proceed to create your project folder and then cd into that directory.

	$ mkdir angular-webspeech-directive && cd angular-webspeech-directive
	
Now use [Yeoman](http://yeoman.io/) to create your project files, execute the following command:

	$ yo angular-component
	
Then proceed to answer a few questions about your project.

	[?] Would you mind telling me your username on Github? jonniespratley
	[?] What's the base name of your project? angular-webspeech-directive
	[?] Under which lincense your project shall be released? MIT
	[?] Do you need the unstable branch of AngularJS? Yes
	[?] Does your module requires CSS styles? Yes


For distribution, register the new project with Bower (a web library package manager), execute the following command:

	$ bower register [name] [endpoint]

Now your component is available to the world via the `bower` package manager.




### Step 2 - Create the Directive
To create a directive with AngularJS it is best to create a module for your directive, then attach your directive definition to your module instance. 

This allows users of the component to easily include the required `scripts` and declare the component in the existing applications dependencies array.


#### 2.1 - Module Definition
To define the module, use the `angular.module()` method to create a module instance, in this case the variable `_app` is the components module.

	# Module instance
	_app = angular.module('jonniespratley.angularWebSpeechDirective', [])

The `angular.module` is a global method for creating, registering and retrieving Angular modules. 

1. When passed two or more arguments, a new module is created. 

		angular.module('jonniespratley.angularWebSpeechDirective', [])

2. If passed only one argument, an existing module (the name passed as the first argument to module) is retrieved.

		angular.module('jonniespratley.angularWebSpeechDirective')

All modules that should be available to an application must be registered using this method.

#### 2.2 - Factory Definition
To define a

	
	#Factory definition
	_app.service 'jsSpeechFactory', (['$rootScope', ($rootScope) -> 
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
				s.replace(/\n\n/g, "<p></p>").replace /\n/g, "<br>" 
			capitalize: (s) ->
				s.replace /\S/, (m) ->
					m.toUpperCase()
			
	])
	




#### 2.3 - Directive Definition

The restrict option is typically set to:

* `A` - only matches attribute name: `<span my-dir="exp"></span>`
* `E` - only matches element name: `<my-dir></my-dir>`
* `AE` - matches either attribute or element name

**Tip:** `transclude` makes the contents of a directive with this option have access to the scope outside of the directive rather than inside.

**Best Practice:** Use `controller` when you want to expose an API to other directives.

	# Directive definition
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
			#Contents below
	])




#### 2.4 - Directive Logic
Directives that modify the DOM use the link option, which takes a function with the following signature: 

	function link(scope, element, attrs, /*ngModel optional*/) {
		#Adjust the DOM, add event listeners
	} 
	

Parameter descriptions:
	
* `scope` - is an Angular scope object.
* `element` - is the jqLite-wrapped element that this directive matches.
* `attrs` - is an object with the normalized attribute names and their corresponding values.
* `ngModel` - is a `ngModelController` object that provides an API for the `ng-model` directive, with services for data-binding, validation, CSS updates, and value formatting and parsing.



##### Link Function
In order to properly hook into the directive you must provide a link function.

	link: (scope, element, attrs, ngModel) ->
		$scope = scope
	
	
			
##### Setup default otpions
Setup the user interface.

	$scope.speech = 
	  msg: jsSpeechFactory.messages.info_setup
	  icon: jsSpeechFactory.icons.start
	  recognizing: false

##### Watch the Model
To watch the model for any changes call the `$watch` method on the scope.
	
	scope.$watch('ngModel', (newVal, oldVal) ->
     	console.log newVal
	, true)
			  	
##### Safe $apply 
Utility for doing a safe `$apply`, basically this method checks to see if a `$apply` is already in progress.
		
	safeApply = (fn) ->
      phase = scope.$root.$$phase
      if phase is "$apply" or phase is "$digest"
        fn()  if fn and (typeof (fn) is "function")
      else
        scope.$apply fn
	    
##### Set the message
Utility method for setting the message value in the ui.
		
    setMsg = (msg) -> 
      safeApply(()->
        $scope.speech.msg = jsSpeechFactory.messages[msg]
      )
    
	  
##### Set the icon
Utility method for setting the image icon in the ui.
  
    setIcon = (icon) ->
      safeApply(()->
        $scope.speech.icon = jsSpeechFactory.icons[icon]  
      )

	
##### Initialize
Handle checking to see if the browser has the api.
	
	#Init the ui
	init = ->
		$scope.reset()
		if 'webkitSpeechRecognition' of window
  		  recognition = new webkitSpeechRecognition()
  		  recognition.continuous = true
  		  recognition.interimResults = true
  		  recognition.onerror = $scope.onerror
  		  recognition.onend = $scope.reset
  		  recognition.onresult = $scope.onresult
  		  recognition.onstart = $scope.onstart
		else
			recognition = {}
			upgrade()
		
	
##### Show Upgrade UI
Setup the user interface by setting the message and icon.
		
	#Show error message and change icon
	upgrade = ->
	  setMsg 'info_upgrade'
	  setIcon 'blocked'
	
##### Start Handler
Handle when the recording starts up.

	$scope.onstart = (event) ->
		setIcon 'recording'
		console.log 'onstart', event
				
##### Error Handler
Handle error
		
	#Handle error
	$scope.onerror = (event, message) ->
		console.log 'onerror', event, message
		switch event.error
			when "not-allowed"
				setMsg 'info_blocked'
			else
				console.log event
		setMsg 'info_denied'
			
##### Result Handler
Handle building the string from the result event.

	$scope.onresult = (event) ->
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
			
			
##### Reset Handler
If its the file, set on the model
	  
	#If its the file, set on the model
	$scope.reset = (event) ->
		console.log 'reset', event
		$scope.speech.recognizing = false
		setIcon 'start'
		setMsg 'info_setup'

	# Let the user abort.
	$scope.abort = () ->
		$scope.toggleStartStop()
	    

##### Toggle Button UI
Setup the user interface.
		
	#Handle toggling
	$scope.toggleStartStop = ->
		if $scope.speech.recognizing
			recognition.stop()
			$scope.reset()
		else
			recognition.start()
			$scope.speech.recognizing = true
			setIcon 'blocked'

	init()
			




## * Usage 

Download the [production version][min] or the [development version][max].

Or install via bower:

	bower install angular-webspeech-directive --save


Add to main page:

	<script src="angular.js"></script>
	<script src="dist/angular-webspeech-directive.min.js"></script>

Add to main script:
	
	# Add to dependencies
	app = angular.module("plunker", ["jonniespratley.angularWebSpeechDirective"])
	

Add to view:
	
	<js-speech ng-model="speech"></js-speech>
	

Add to controller:

	# Some controller
	app.controller "MainCtrl", ($scope) ->

	  $scope.speech = 
	    maxResults: 25
	    continuous: true
	    interimResults: true
  	    onstart: (e) -> 
	      console.log e
	    onresult: (e) ->
	      console.log e





## * Documentation
For detailed information about the W3C Web Speech API visit the [website](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html).




## * Examples
For an example visit the [Plunkr](http://embed.plnkr.co/8xz2dUFKMZQIfFvSu0zA/preview).

![image](https://dl.dropboxusercontent.com/u/26906414/cdn/img/webspeech-tonight.png)