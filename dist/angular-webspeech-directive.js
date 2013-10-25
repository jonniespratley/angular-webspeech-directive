(function () {
  'use strict';
  var _app;
  _app = angular.module('jonniespratley.angularWebSpeechDirective', []);
  _app.service('jsSpeechFactory', [
    '$rootScope',
    function ($rootScope) {
      var first_char, jsSpeechFactory, one_line, two_line;
      two_line = /\n\n/g;
      one_line = /\n/g;
      first_char = /\S/;
      return jsSpeechFactory = {
        icons: {
          start: 'http://goo.gl/2bfneP',
          recording: 'http://goo.gl/p2jHO9',
          blocked: 'http://goo.gl/vd4AKi'
        },
        messages: {
          info_speak_now: 'Speak now... or <a href="#" ng-click="abort()">Cancel</a>',
          info_stop: 'Proccessing your voice...',
          info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.',
          info_no_mic: 'No microphone was found. Ensure that a microphone is installed.',
          info_blocked: 'Permission to use microphone is blocked. To change, go to <a href="chrome://settings/contentExceptions#media-stream">chrome://settings/contentExceptions#media-stream</a>.',
          info_denied: 'Permission to use microphone was denied.',
          info_setup: 'Click on the microphone icon to enable Web Speech.',
          info_upgrade: 'Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome" target="_blank">Chrome</a> version 25 or later.',
          info_allow: 'Click the "Allow" button above to enable your microphone.'
        },
        linebreak: function (s) {
          return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
        },
        capitalize: function (s) {
          return s.replace(first_char, function (m) {
            return m.toUpperCase();
          });
        }
      };
    }
  ]);
  _app.directive('jsSpeech', [
    'jsSpeechFactory',
    function (jsSpeechFactory) {
      ({
        restrict: 'AE',
        replace: true,
        transclude: true,
        require: '^ngModel',
        scope: { ngModel: '=' },
        template: '<div class="jsSpeechFactory-container">\n<a href="" class="jsSpeechFactory-btn" ng-click="toggleStartStop()">\n<img ng-src="{{speech.icon}}" class="jsSpeechFactory-icon"/></a>\n<input type="text" class="form-control" ng-model="ngModel.value"/>\n<p class="text-muted jsSpeechFactory-hint" ng-bind-html-unsafe="speech.msg"></p>\n</div>',
        link: function (scope, element, attrs, ngModel) {
          var $scope, init, onerror, onresult, onstart, recognition, recognizing, reset, safeApply, setIcon, setMsg, upgrade;
          $scope = scope;
          recognizing = false;
          recognition = null;
          $scope.speech = {
            msg: jsSpeechFactory.messages.info_setup,
            icon: jsSpeechFactory.icons.start,
            recognizing: false
          };
          scope.$watch('ngModel', function (newVal, oldVal) {
            return console.log(newVal);
          }, true);
          safeApply = function (fn) {
            var phase;
            phase = scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
              if (fn && typeof fn === 'function') {
                return fn();
              }
            } else {
              return scope.$apply(fn);
            }
          };
          setMsg = function (msg) {
            return safeApply(function () {
              return $scope.speech.msg = jsSpeechFactory.messages[msg];
            });
          };
          setIcon = function (icon) {
            return safeApply(function () {
              return $scope.speech.icon = jsSpeechFactory.icons[icon];
            });
          };
          init = function () {
            reset();
            if ('webkitSpeechRecognition' in window) {
              recognition = new webkitSpeechRecognition();
              recognition.continuous = true;
              recognition.interimResults = true;
              recognition.onerror = onerror;
              recognition.onend = reset;
              recognition.onresult = onresult;
              return recognition.onstart = onstart;
            } else {
              recognition = {};
              return upgrade();
            }
          };
          upgrade = function () {
            setMsg('info_upgrade');
            return setIcon('blocked');
          };
          onstart = function (event) {
            setIcon('recording');
            return console.log('onstart', event);
          };
          onerror = function (event, message) {
            console.log('onerror', event, message);
            switch (event.error) {
            case 'not-allowed':
              setMsg('info_blocked');
              break;
            default:
              console.log(event);
            }
            return setMsg('info_denied');
          };
          onresult = function (event) {
            var i, result, resultIndex, trans, _results;
            setIcon('recording');
            setMsg('info_speak_now');
            resultIndex = event.resultIndex;
            trans = '';
            i = resultIndex;
            _results = [];
            while (i < event.results.length) {
              result = event.results[i][0];
              trans = jsSpeechFactory.capitalize(result.transcript);
              safeApply(function () {
                return $scope.ngModel.interimResults = trans;
              });
              if (event.results[i].isFinal) {
                safeApply(function () {
                  return $scope.ngModel.value = trans;
                });
              }
              _results.push(++i);
            }
            return _results;
          };
          reset = function (event) {
            console.log('reset', event);
            $scope.speech.recognizing = false;
            setIcon('start');
            return setMsg('info_setup');
          };
          $scope.abort = function () {
            return $scope.toggleStartStop();
          };
          return $scope.toggleStartStop = function () {
            if ($scope.speech.recognizing) {
              recognition.stop();
              return reset();
            } else {
              recognition.start();
              $scope.speech.recognizing = true;
              return setIcon('blocked');
            }
          };
        }
      });
      return init();
    }
  ]);
}.call(this));