(function () {
  'use strict';
  var Speech, _app;
  Speech = function () {
    var icons, messages, recognition, recording;
    icons = {
      start: 'mic.gif',
      recording: 'mic-animate.gif',
      blocked: 'mic-slash.gif'
    };
    messages = {
      info_speak_now: 'Speak now.',
      info_stop: 'Proccessing your voice...',
      info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.',
      info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that',
      info_blocked: 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream',
      info_denied: 'Permission to use microphone was denied.',
      info_setup: 'Click on the microphone icon to activate voice recognition.',
      info_upgrade: 'Web jsSpeechFactory API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.',
      info_allow: 'Click the "Allow" button above to enable your microphone.'
    };
    recording = false;
    recognition = null;
    function Speech() {
      this.setMsg('info_setup');
      this.supported = this.checkBrowser();
      console.log(this);
    }
    Speech.prototype.start = function () {
      this.enable();
      recording = true;
      return recognition.start();
    };
    Speech.prototype.stop = function () {
      recording = false;
      return recognition.stop();
    };
    Speech.prototype.checkBrowser = function () {
      return 'webkitSpeechRecognition' in window;
    };
    Speech.prototype.setMsg = function (key) {
      if (messages[key]) {
        this.message = messages[key];
      } else {
        this.message = key;
      }
      return console.log(key, this.message);
    };
    Speech.prototype.enable = function () {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = this.onstart;
      recognition.onerror = this.onerror;
      recognition.onend = this.onend;
      return recognition.onresult = this.onresult;
    };
    Speech.prototype.onstart = function (event) {
      return console.log(event);
    };
    Speech.prototype.onend = function (event) {
      return console.log(event);
    };
    Speech.prototype.onresult = function (event) {
      var i, trans;
      trans = '';
      if (typeof event.results === 'undefined') {
        recognition.onend = null;
        recognition.stop();
        return;
      }
      i = event.resultIndex;
      while (i < event.results.length) {
        trans += event.results[i][0].transcript;
        console.log(trans);
        ++i;
      }
      return Speech.message = trans;
    };
    Speech.prototype.onerror = function (event) {
      return console.log(event);
    };
    return Speech;
  }();
  window.Speech = new Speech();
  _app = angular.module('jonniespratley.angularWebSpeechDirective', []);
  _app.service('jsSpeechFactory', [
    '$rootScope',
    function ($rootScope) {
      var jsSpeechFactory, _this = this;
      jsSpeechFactory = {
        startTimestamp: null,
        recognizing: false,
        recording: false,
        recognition: null,
        ignoreEnd: null,
        transcript: null,
        messages: {
          info_speak_now: 'Speak now.',
          info_stop: 'Proccessing your voice...',
          info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.',
          info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that',
          info_blocked: 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream',
          info_denied: 'Permission to use microphone was denied.',
          info_setup: 'Click on the microphone icon to activate voice recognition.',
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
          icon: '.jsSpeechFactory-icon',
          btn: '.jsSpeechFactory-btn',
          container: '.jsSpeechFactory-container',
          hint: '.jsSpeechFactory-hint',
          status: '.jsSpeechFactory-status',
          message: '.jsSpeechFactory-message'
        },
        icons: {
          start: 'mic.gif',
          recording: 'mic-animate.gif',
          blocked: 'mic-slash.gif'
        },
        init: function (options) {
          this.options = options;
          this.scope = options.scope;
          console.log('jsSpeechFactory.init()', this);
          if ('webkitSpeechRecognition' in window) {
            this.setup();
          } else {
            this.showUpgrade();
          }
          $rootScope.Speech = this;
          return this;
        },
        showInfo: function (message) {
          console.log('jsSpeechFactory.showInfo()', this);
          this.model.message = this.messages[message];
          return console.log(message);
        },
        showUpgrade: function () {
          return console.log('jsSpeechFactory.showUpgrade()', this);
        },
        setup: function () {
          console.log('jsSpeechFactory.setup()', this);
          this.showInfo('info_setup');
          this.model.icon = this.icons.start;
          this.recognition = new webkitSpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.onstart = this.onstart;
          this.recognition.onerror = this.onerror;
          this.recognition.onend = this.onend;
          return this.recognition.onresult = this.onresult;
        },
        start: function () {
          console.log('jsSpeechFactory.start()');
          this.showInfo('info_allow');
          this.changeIcon('blocked');
          this.recognition.stop();
          return this.recognition.start();
        },
        toggle: function () {
          if (this.recognizing) {
            return this.stop();
          } else {
            return this.start();
          }
        },
        stop: function () {
          console.log('jsSpeechFactory.stop()');
          this.recognizing = false;
          this.recognition.stop();
          this.changeIcon('start');
          return this.showInfo('info_stop');
        },
        capitalize: function (s) {
          this.log(s);
          return s;
        },
        changeIcon: function (icon) {
          return jsSpeechFactory.model.icon = jsSpeechFactory.icons[icon];
        },
        showResults: function (s) {
          return alert(s);
        },
        log: function () {
          return console.log(arguments);
        },
        onstart: function (event) {
          console.log('jsSpeechFactory.onstart()', event);
          jsSpeechFactory.recognizing = true;
          jsSpeechFactory.startTimestamp = new Date();
          jsSpeechFactory.showInfo('info_speak_now');
          return jsSpeechFactory.changeIcon('recording');
        },
        onerror: function (event, msg) {
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
        onend: function (event) {
          jsSpeechFactory.options.onend(event);
          console.log('jsSpeechFactory.onend()', event);
          jsSpeechFactory.recognizing = false;
          if (jsSpeechFactory.ignoreEnd) {
            return;
          }
          jsSpeechFactory.changeIcon('start');
          if (!jsSpeechFactory.transcript) {
            jsSpeechFactory.showInfo('info_start');
            return;
          }
          return jsSpeechFactory.showInfo('');
        },
        onresult: function (event) {
          var i, trans;
          console.log('jsSpeechFactory.onresult()', event);
          jsSpeechFactory.recognizing = false;
          trans = '';
          if (typeof event.results === 'undefined') {
            this.recognition.onend = null;
            this.recognition.stop();
            jsSpeechFactory.showUpgrade();
            return;
          }
          i = event.resultIndex;
          while (i < event.results.length) {
            trans += event.results[i][0].transcript;
            console.log(trans, event.results[i][0]);
            jsSpeechFactory.options.onresult(trans);
            ++i;
          }
          jsSpeechFactory.showResults(trans);
          return jsSpeechFactory.transcript = jsSpeechFactory.capitalize(jsSpeechFactory.transcript);
        }
      };
      return window.jsSpeechFactory = jsSpeechFactory;
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
        template: '<div class="jsSpeechFactory-container"><p ng-bind-html-unsafe="msg"></p><a id="button" class="jsSpeechFactory-btn" ng-click="toggleStartStop()"><img ng-src="{{Speech.icon}}" class="jsSpeechFactory-icon"/></a><textarea id="textarea" rows="4" class="form-control" ng-model="myModel"></textarea></div>',
        require: 'ngModel',
        link: function (scope, lElement, lAttrs, ngModel) {
          var $scope, icons, recognition, recognizing;
          $scope = scope;
          recognizing = false;
          recognition = new webkitSpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          $scope.messages = {
            info_speak_now: 'Speak now.',
            info_stop: 'Proccessing your voice...',
            info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.',
            info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that',
            info_blocked: 'Permission to use microphone is blocked. To change, go to <a href="chrome://settings/contentExceptions#media-stream">chrome://settings/contentExceptions#media-stream</a>.',
            info_denied: 'Permission to use microphone was denied.',
            info_setup: 'Click on the microphone icon to enable Web Speech.',
            info_upgrade: 'Web jsSpeechFactory API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.',
            info_allow: 'Click the "Allow" button above to enable your microphone.'
          };
          icons = {
            start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.png',
            recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic2-animate.gif',
            blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.png'
          };
          $scope.myModel = '';
          $scope.msg = $scope.messages.info_setup;
          $scope.Speech = { icon: icons.start };
          $scope.onstart = function (event) {
            $scope.$apply(function () {
              return $scope.Speech.icon = icons.recording;
            });
            return console.log('onstart', event);
          };
          $scope.onerror = function (event, message) {
            console.log('onerror', event, message);
            switch (event.error) {
            case 'not-allowed':
              return $scope.$apply(function () {
                return $scope.msg = $scope.messages.info_blocked;
              });
            default:
              return console.log(event);
            }
          };
          $scope.onresult = function (event) {
            var i, result, resultIndex, trans, _results;
            resultIndex = event.resultIndex;
            console.log('Handle results', event);
            $scope.$apply(function () {
              $scope.Speech.icon = icons.recording;
              return $scope.msg = 'Speak into the mic...';
            });
            i = resultIndex;
            _results = [];
            while (i < event.results.length) {
              result = event.results[i][0];
              trans = result.transcript;
              console.log(event.results[i]);
              $scope.myModel = trans;
              if (event.results[i].isFinal) {
                console.log(trans);
                $scope.myModel = trans;
              }
              _results.push(++i);
            }
            return _results;
          };
          $scope.reset = function (event) {
            console.log('reset', event);
            recognizing = false;
            $scope.Speech.icon = icons.start;
            return $scope.msg = $scope.messages.info_setup;
          };
          $scope.toggleStartStop = function () {
            if (recognizing) {
              recognition.stop();
              return $scope.reset();
            } else {
              recognition.start();
              recognizing = true;
              $scope.myModel = '';
              return $scope.Speech.icon = icons.blocked;
            }
          };
          $scope.reset();
          recognition.onerror = $scope.onerror;
          recognition.onend = $scope.reset;
          recognition.onresult = $scope.onresult;
          recognition.onstart = $scope.onstart;
          return console.log(scope);
        }
      };
    }
  ]);
}.call(this));