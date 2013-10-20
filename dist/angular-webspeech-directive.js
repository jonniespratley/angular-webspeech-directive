(function () {
  'use strict';
  var _app;
  _app = angular.module('jonniespratley.angularWebSpeechDirective', []);
  _app.factory('jsSpeechFactory', [
    '$rootScope',
    function ($rootScope) {
      var jsSpeechFactory, _this = this;
      return window.jsSpeechFactory = jsSpeechFactory = {
        startTimestamp: null,
        recognizing: false,
        recording: false,
        recognition: null,
        ignoreEnd: null,
        transcript: null,
        messages: {
          info_recording: 'Speak now.',
          info_no_jsSpeechFactory: 'No jsSpeechFactory was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.',
          info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that',
          info_blocked: 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream',
          info_denied: 'Permission to use microphone was denied.',
          info_start: 'Click on the microphone icon and begin speaking for as long as you like.',
          info_upgrade: 'Web jsSpeechFactory API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.',
          info_allow: 'Click the "Allow" button above to enable your microphone.'
        },
        model: {
          icon: null,
          status: null,
          message: null,
          results: null
        },
        elements: {
          icon: angular.element('.jsSpeechFactory-icon'),
          btn: angular.element('.jsSpeechFactory-btn'),
          container: angular.element('.jsSpeechFactory-container'),
          hint: angular.element('.jsSpeechFactory-hint'),
          status: angular.element('.jsSpeechFactory-status'),
          message: angular.element('.jsSpeechFactory-message')
        },
        icons: {
          start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.gif',
          recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-animate.gif',
          blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.gif'
        },
        init: function (scope) {
          this.scope = scope;
          this.log('jsSpeechFactory.init()', this);
          if ('webkitSpeechRecognition' in window) {
            this.setup();
          } else {
            this.showUpgrade();
          }
          this.model.message = this.messages.info_start;
          this.changeIcon('start');
          return scope.Speech = this;
        },
        showUpgrade: function () {
          return this.log('jsSpeechFactory.showUpgrade()', this);
        },
        setup: function () {
          this.log('jsSpeechFactory.setup()', this);
          this.recognition = new webkitSpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.changeIcon('blocked');
          this.recognition.onstart = this.onstart;
          this.recognition.onerror = this.onerror;
          this.recognition.onend = this.onend;
          return this.recognition.onresult = this.onresult;
        },
        start: function () {
          this.log('jsSpeechFactory.start()');
          this.showInfo('info_recording');
          this.recognizing = true;
          this.startTimestamp = new Date();
          return this.recognition.start();
        },
        toggle: function () {
          if (this.recognizing) {
            return jsSpeechFactory.stop();
          } else {
            return jsSpeechFactory.start();
          }
        },
        changeIcon: function (what) {
          return this.model.icon = this.icons[what];
        },
        stop: function () {
          this.log('jsSpeechFactory.stop()');
          this.recognition.stop();
          this.model.message = 'Stopped';
          return this.showInfo('info_start');
        },
        onstart: function (event) {
          jsSpeechFactory.log('jsSpeechFactory.onstart()', event);
          jsSpeechFactory.recognizing = true;
          jsSpeechFactory.showInfo('info_speak_now');
          return jsSpeechFactory.changeIcon('recording');
        },
        onerror: function (event) {
          console.log('jsSpeechFactory.onerror()', event);
          if (event.error === 'no-speech') {
            jsSpeechFactory.model.icon = jsSpeechFactory.icons.start;
            jsSpeechFactory.showInfo('info_no_jsSpeechFactory');
            jsSpeechFactory.ignoreEnd = true;
          }
          if (event.error === 'audio-capture') {
            jsSpeechFactory.model.icon = jsSpeechFactory.icons.start;
            jsSpeechFactory.showInfo('info_no_microphone');
            jsSpeechFactory.ignoreEnd = true;
          }
          if (event.error === 'not-allowed') {
            if (event.timeStamp - jsSpeechFactory.startTimestamp < 100) {
              jsSpeechFactory.showInfo('info_blocked');
            } else {
              jsSpeechFactory.showInfo('info_denied');
            }
            return jsSpeechFactory.ignoreEnd = true;
          }
        },
        onend: function () {
          console.log('jsSpeechFactory.onend()');
          jsSpeechFactory.recognizing = false;
          if (jsSpeechFactory.ignoreEnd) {
            return;
          }
          jsSpeechFactory.model.icon = jsSpeechFactory.icons.start;
          if (!jsSpeechFactory.transcript) {
            jsSpeechFactory.showInfo('info_start');
            return;
          }
          return jsSpeechFactory.showInfo('');
        },
        onresult: function (event) {
          var i, interim_transcript, trans;
          jsSpeechFactory.log('jsSpeechFactory.onresult()', event);
          jsSpeechFactory.recognizing = false;
          interim_transcript = '';
          if (typeof event.results === 'undefined') {
            this.recognition.onend = null;
            this.recognition.stop();
            jsSpeechFactory.showUpgrade();
            return;
          }
          i = event.resultIndex;
          while (i < event.results.length) {
            trans = event.results[i][0].transcript;
            jsSpeechFactory.model.result += trans;
            console.log(trans);
            if (event.results[i].isFinal) {
              jsSpeechFactory.transcript += event.results[i][0].transcript;
              jsSpeechFactory.stop();
            } else {
              jsSpeechFactory.transcript += event.results[i][0].transcript;
            }
            ++i;
          }
          return jsSpeechFactory.transcript = jsSpeechFactory.capitalize(jsSpeechFactory.transcript);
        },
        showInfo: function (message) {
          jsSpeechFactory.log('jsSpeechFactory.showInfo()', this);
          return this.message = this.messages[message];
        },
        capitalize: function (s) {
          return this.log(s);
        },
        linebreak: function (s) {
          return this.log(s);
        },
        log: function () {
          return console.log(arguments);
        }
      };
    }
  ]);
  _app.directive('jsSpeech', [
    'jsSpeechFactory',
    function (jsSpeechFactory) {
      return {
        restrict: 'EAC',
        scope: true,
        replace: true,
        transclude: true,
        templateUrl: '../src/tmpl.html',
        link: function (scope, lElement, lAttrs, transclude) {
          scope.Speech = jsSpeechFactory.init(scope);
          return console.log('jsSpeechFactory', jsSpeechFactory, scope);
        }
      };
    }
  ]);
}.call(this));