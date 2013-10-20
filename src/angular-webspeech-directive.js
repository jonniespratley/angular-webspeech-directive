'use strict';

angular.module('jonniespratley.angularWebspeechDirective', [])

  .directive('myDirective', function() {

    return {
      restrict: 'EAC',
      scope: true,
      compile: function compile(tElement, tAttrs, transclude) {
        tElement.html('<span>hello {{name}}</span>');
        return function postLink(scope, iElement, iAttrs, controller) {
          scope.name = 'world';
        };
      }
    };

  });
