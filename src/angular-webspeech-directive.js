(function() {
  'use strict';
  var _app;

  _app = angular.module('jonniespratley.angularWebSpeechDirective', []);

  _app.service('jsSpeechFactory', [
    '$rootScope', function($rootScope) {
      var jsSpeechFactory;
      return jsSpeechFactory = {
        icons: {
          start: 'http://goo.gl/dBS39a',
          recording: 'http://goo.gl/7JLqdm',
          blocked: 'http://goo.gl/j8MZhD'
        },
        messages: {
          info_speak_now: 'Speak now.',
          info_stop: 'Proccessing your voice...',
          info_no_speech: 'No Speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.',
          info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that',
          info_blocked: 'Permission to use microphone is blocked. To change, go to <a href="chrome://settings/contentExceptions#media-stream">chrome://settings/contentExceptions#media-stream</a>.',
          info_denied: 'Permission to use microphone was denied.',
          info_setup: 'Click on the microphone icon to enable Web Speech.',
          info_upgrade: 'Web jsSpeechFactory API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.',
          info_allow: 'Click the "Allow" button above to enable your microphone.'
        }
      };
    }
  ]);

  _app.directive('jsSpeech', [
    'jsSpeechFactory', function(jsSpeechFactory) {
      return {
        restrict: 'EAC',
        scope: true,
        replace: true,
        transclude: true,
        require: '^ngModel',
        template: '' + '<div class="jsSpeechFactory-container">' + '<p ng-bind-html-unsafe="msg"></p>' + '<a class="jsSpeechFactory-btn" ng-click="toggleStartStop()">' + '<img ng-src="{{icon}}" class="jsSpeechFactory-icon"/></a>' + '<textarea rows="4" class="form-control" ng-model="ngModel"></textarea>' + '</div>',
        link: function(scope, lElement, lAttrs, ngModel) {
          var $scope, recognition, recognizing;
          $scope = scope;
          recognizing = false;
          recognition = new webkitSpeechRecognition({
            continuous: true,
            interimResults: true
          });
          $scope.msg = jsSpeechFactory.messages.info_setup;
          $scope.icon = jsSpeechFactory.icons.start;
          $scope.onstart = function(event) {
            $scope.$apply(function() {
              return $scope.icon = jsSpeechFactory.icons.recording;
            });
            return console.log('onstart', event);
          };
          $scope.onerror = function(event, message) {
            console.log('onerror', event, message);
            switch (event.error) {
              case 'not-allowed':
                return $scope.$apply(function() {
                  return $scope.msg = jsSpeechFactory.messages.info_blocked;
                });
              case 'no-speech':
                return $scope.msg = jsSpeechFactory.messages.info_no_speech;
              case 'aborted':
                return $scope.msg = jsSpeechFactory.messages.info_setup;
              case 'audio-capture':
                return $scope.msg = jsSpeechFactory.messages.info_no_mic;
              case 'bad-grammar':
                return $scope.msg = jsSpeechFactory.messages.info_no_speech;
              default:
                return console.log(event);
            }
          };
          $scope.onresult = function(event) {
            var i, result, resultIndex, trans, _results;
            resultIndex = event.resultIndex;
            console.log('Handle results', event);
            $scope.$apply(function() {
              $scope.icon = jsSpeechFactory.icons.recording;
              return $scope.msg = 'Speak into the mic...';
            });
            i = resultIndex;
            _results = [];
            while (i < event.results.length) {
              result = event.results[i][0];
              trans = result.transcript;
              $scope.ngModel = trans;
              if (event.results[i].isFinal) {
                console.log(trans);
                $scope.ngModel = trans;
              }
              _results.push(++i);
            }
            return _results;
          };
          $scope.reset = function(event) {
            console.log('reset', event);
            recognizing = false;
            $scope.icon = jsSpeechFactory.icons.start;
            return $scope.msg = jsSpeechFactory.messages.info_setup;
          };
          $scope.toggleStartStop = function() {
            if (recognizing) {
              recognition.stop();
              return $scope.reset();
            } else {
              recognition.start();
              recognizing = true;
              $scope.ngModel = "";
              return $scope.icon = jsSpeechFactory.icons.blocked;
            }
          };
          $scope.reset();
          recognition.onerror = $scope.onerror;
          recognition.onend = $scope.reset;
          recognition.onresult = $scope.onresult;
          return recognition.onstart = $scope.onstart;
        }
      };
    }
  ]);

}).call(this);
