[min]: https://raw.github.com/jonniespratley/jquery-angular-webspeech-directive/master/dist/angular-angular-webspeech-directive.min.js
[max]: https://raw.github.com/jonniespratley/jquery-angular-webspeech-directive/master/dist/angular-angular-webspeech-directive.js

# HTML5 Web Speech AngularJS Directive
[AngularJS](http://angularjs.org/) is one of the hottest JavaScript frameworks on the internet providing a full stack for creating single page applications (SPAs).

[Angular Directives](http://docs.angularjs.org/guide/directive) are a way to teach HTML new tricks. During DOM compilation directives are matched against the HTML and executed. This allows directives to register behavior, or transform the DOM. 
 
The[ Web Speech API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html) provides an alternative input method for web applications *(without using a keyboard)*. Developers can give web applications the ability to transcribe voice to text, from the computer's microphone. 

 
![image](http://goo.gl/oYiKJ4)

## * Tutorial 
To quickly get started creating a custom component for AngularJS, install the [AngularJS Component Generator](https://github.com/mgcrea/generator-angular-component), execute the following command:

	$ sudo npm install -g generator-angular-component
	
Now you'll be able to scaffold a angular component project.


### Step 1 - Create the project
Proceed to create the project folder and then cd into that directory.

	$ mkdir angular-webspeech-directive && cd angular-webspeech-directive
	
Now use [Yeoman](http://yeoman.io/) to create the project files, execute the following command:

	$ yo angular-component
	
Then proceed to answer a few questions about your project.

	[?] Would you mind telling me your username on Github? jonniespratley
	[?] What's the base name of your project? angular-webspeech-directive
	[?] Under which lincense your project shall be released? MIT
	[?] Do you need the unstable branch of AngularJS? Yes
	[?] Does your module requires CSS styles? Yes


For distribution, register the new project with [Bower](http://bower.io/) (a web library package manager), execute the following command:

	$ bower register [component-name] [component-github]

Now the component is available to the world via the `bower` package manager.




### Step 2 - Create the Directive
To create a directive with [AngularJS](http://angularjs.org/) it is best to create a module for the directive, then attach the directive definition to your module instance. 

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
The `factory` module is a good way to store methods or properties that can be reused throughout your directive. We create a `factory` for storing the icons, messages and some utility methods that the directive will use.

To register a service factory, which will be called to return the service instance, use the following format:

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
The `directive` definition object options available are as follows:


Property | Description
------------ | ------------- 
restrict | Declare how directive can be used in a template as an element, attribute, class, comment, or any combination. 
priority | Set the order of execution in the template relative to other directives on the element.
template | Specify an inline template as a string. Not used if you’re specifying your template as a URL.
templateUrl | Specify the template to be loaded by URL. This is not used if you’ve specified an inline template as a string.
replace | If true, replace the current element. If false or unspecified, append this directive to the current element.
transclude | Lets you move the original children of a directive to a location inside the new template.
scope | Create a new scope for this directive rather than inheriting the parent scope.
controller |  Create a controller which publishes an API for communicating across directives.
require | Require that another directive be present for this directive to function correctly
link | Programmatically modify resulting DOM element instances, add event listeners, and set up data binding.
compile | Programmatically modify the DOM template for features across copies of a directive, as when used in ng-repeat


The definition object that this directive will use is as follows:

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



##### a. Link Function
In order to properly hook into the directive to attach event listeners and manipulate the DOM provide a link function.

	link: (scope, element, attrs, ngModel) ->
		$scope = scope
	
	
			
##### b. Setup default options
Setup the user interface with default options.

	$scope.speech = 
	  msg: jsSpeechFactory.messages.info_setup
	  icon: jsSpeechFactory.icons.start
	  recognizing: false


##### c. Watch the Model
To watch the model for any changes call the `$watch` method on the scope.
	
	scope.$watch('ngModel', (newVal, oldVal) ->
     	console.log newVal
	, true)
			  	
##### d. Safe $apply 
Utility for doing a safe `$apply`, basically this method checks to see if a `$apply` is already in progress.
		
	safeApply = (fn) ->
      phase = scope.$root.$$phase
      if phase is "$apply" or phase is "$digest"
        fn()  if fn and (typeof (fn) is "function")
      else
        scope.$apply fn
	    
##### e. Set the message
Utility method for setting the message value in the UI.
		
    setMsg = (msg) -> 
      safeApply(()->
        $scope.speech.msg = jsSpeechFactory.messages[msg]
      )
    
	  
##### f. Set the icon
Utility method for setting the image icon in the UI.
  
    setIcon = (icon) ->
      safeApply(()->
        $scope.speech.icon = jsSpeechFactory.icons[icon]  
      )

	
##### g. Initialize
Handle checking to see if the browser has the api.
	
	init = ->
		reset()
		if 'webkitSpeechRecognition' of window
  		  recognition = new webkitSpeechRecognition()
  		  recognition.continuous = true
  		  recognition.interimResults = true
  		  recognition.onerror = onerror
  		  recognition.onend = reset
  		  recognition.onresult = onresult
  		  recognition.onstart = onstart
		else
			recognition = {}
			upgrade()
		
	
##### h. Show Upgrade UI
Handle changing the UI by setting the message and icon.
		
	upgrade = ->
	  setMsg 'info_upgrade'
	  setIcon 'blocked'
	
##### i. Start Handler
Handle when the recording starts up.

	onstart = (event) ->
		setIcon 'recording'
		setMsg 'info_speak_now'
		console.log 'onstart', event

				
##### j. Error Handler
Handle any errors from the Speech Recognition API.
		
	onerror = (event, message) ->
		console.log 'onerror', event, message
		switch event.error
			when "not-allowed"
				setMsg 'info_blocked'
			when "no-speech"
				setMsg 'info_no_speech'
			when "service-not-allowed"
				setMsg 'info_denied'
			else
				console.log event
		
			
##### k. Result Handler
Handle processing the results from the Speech Recognition API.

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
			
			
##### l. Reset Handler
Handle reseting the UI after recognition is complete.
	  
	reset = (event) ->
		console.log 'reset', event
		$scope.speech.recognizing = false
		setIcon 'start'
		setMsg 'info_setup'
	    

##### m. Toggle Button UI
Allow the user to toggle starting and stopping the recognition.
		
	$scope.toggleStartStop = ->
		if $scope.speech.recognizing
			recognition.stop()
			reset()
		else
			recognition.start()
			$scope.speech.recognizing = true
			setIcon 'blocked'

##### n. Start the directive
Finally start the initialization of the directive.

	init()


#### 2.5 - Extending
Now that we have the basic structure and logic to get the Web Speech Recognition API working with a custom UI, extending this directive to add additional functionality should be pretty seamless. 

The code is available on [Github](https://github.com/jonniespratley/angular-webspeech-directive), so feel free to contribute more customizable options, keyword event maps and other logic to make this directive more effective and efficient.
			

## * Usage 

Download the [production version][min] or the [development version][max].

Or install via bower:

	bower install angular-webspeech-directive --save

Add to main page:

	<script src="angular.js"></script>
	<script src="dist/angular-webspeech-directive.min.js"></script>

Add to main script:
	
	app = angular.module("plunker", ["jonniespratley.angularWebSpeechDirective"])
	
Add to view:
	
	<js-speech ng-model="speech"></js-speech>
	

Add to controller:

	app.controller "MainCtrl", ($scope) ->
	  $scope.speech = 
	    maxResults: 25
	    continuous: true
	    interimResults: true
	    value: ''






## * Documentation
For detailed information about the W3C Web Speech API visit the [website](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html).




## * Examples
For an example visit the [Plunkr](http://embed.plnkr.co/8xz2dUFKMZQIfFvSu0zA/preview).

![image](https://dl.dropboxusercontent.com/u/26906414/cdn/img/webspeech-tonight.png)