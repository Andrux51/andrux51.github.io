'use strict';
var app = angular.module('app', ['ngRoute', 'ngSanitize']);

app.directive('calc', function() {
  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    templateUrl: 'calc.html',
    link: function(scope, element, attrs) {
      // console.clear();

      var historyId = 0;
      var result;
      var piValue = 3.141592654;
      scope.calcEval = function() {
        if (calcScreen.value == '') {
          calcScreen.value = $("#calcScreen").attr('placeholder');
        }
        if (calcScreen.value.indexOf("^") !== -1) {
          scope.calcExponent();
        }
        if (calcScreen.value.indexOf("%") !== -1) {
          scope.calcPct();
        }

        if (isNaN(eval(calcScreen.value))) {
          calcScreen.value = "ERROR";
        } else {
          historyId++;
          $("#history").append("<li class='list-group-item' id='history-" + historyId + "'>" + calcScreen.value + "</li>");
          result = eval(calcScreen.value);
          while (String(result).split('').length > 14) {
            result = String(result).slice(0, -1);
          }
          $("#calcScreen").val('').attr('placeholder', result);
          $("#history-" + historyId).append(" = " + result);
          scope.histDisable = false;
        }
      }

      scope.calcExponent = function() {
        var arr = calcScreen.value.split("^");
        if (!arr[1]) {
          calcScreen.value = "ERROR";
        } else {
          calcScreen.value = "Math.pow(" + arr[0] + "," + arr[1] + ")";
        }
      }

      scope.calcPct = function() {
        var arr, sym;
        if (calcScreen.value.indexOf("+") !== -1) {
          arr = calcScreen.value.split("+");
          sym = "+";
        } else if (calcScreen.value.indexOf("-") !== -1) {
          arr = calcScreen.value.split("-");
          sym = "-";
        } else if (calcScreen.value.indexOf("*") !== -1) {
          arr = calcScreen.value.split("*");
          sym = "*";
        } else if (calcScreen.value.indexOf("/") !== -1) {
          arr = calcScreen.value.split("/");
          sym = "/";
        } else calcScreen.value = "ERROR";
        arr[1] = arr[1].slice(0, arr[1].length - 1);
        calcScreen.value = arr[0] + sym + (arr[1] * (arr[0] / 100));
      }

      scope.calcSqrt = function() {
        if (calcScreen.value == '') {
          calcScreen.value = $("#calcScreen").attr('placeholder');
        }
        calcScreen.value = "Math.sqrt(" + calcScreen.value + ")";
        scope.calcEval();
      }

      scope.calcAddInput = function(char) {
        if (calcScreen.value == '' && (char == '+' || char == '-' || char == '*' || char == '/' || char == '^')) {
          calcScreen.value = $("#calcScreen").attr('placeholder');
        }
        if (calcScreen.value.length < 14) {
          if (calcScreen.value == 'ERROR') {} else {
            calcScreen.value += char;
          }
        }
      }

      scope.calcAddPi = function() {
        var piChars = String(piValue).split('');
        console.log(piChars);
        console.log(calcScreen.value.length);
        for (var i in piChars) {
          if (calcScreen.value.length < 14) {
            calcScreen.value += piChars[i];
          }
        }
      }

      scope.calcClear = function() {
        $("#calcScreen").val('').attr('placeholder', 0);
      }
      scope.calcClearAll = function() {
        scope.calcClear();
        $("#history").html('');
        scope.histDisable = true;
      }

      scope.calcBackspace = function() {
        calcScreen.value = calcScreen.value.slice(0, calcScreen.value.length - 1);
      }

      scope.calcInputNegative = function() {
        if (calcScreen.value == '' && $("#calcScreen").attr('placeholder') != '0') {
          calcScreen.value = $("#calcScreen").attr('placeholder');
        }
        if (calcScreen.value.length < 14) {
          var arr = calcScreen.value.split('');
          if (arr[0] == '-') {
            arr.shift();
          } else {
            arr.unshift('-');
          }
          calcScreen.value = arr.join('');
        }
      }

      $("#calcScreen").keydown(function(event) {
        var key = event.keyCode;
        // console.log('key: '+key);
        if (calcScreen.value == 'ERROR' && key != 46) {
          event.preventDefault();
        }
        var shift = event.shiftKey;
        if (calcScreen.value == '' && (key == 107 || key == 109 || key == 106 || key == 111 ||
          (shift && key == 54) || (shift && key == 56) || (shift && key == 187) || key == 189)) {
          calcScreen.value = $("#calcScreen").attr('placeholder');
        }
        if (key > 64 && key < 96 || key == 188) {
          event.preventDefault();
        }
        if (key === 46) {
          calcScreen.value = '';
        }
        if (key === 13) { //Enter key
          scope.calcEval();
          event.preventDefault();
        } else {
          $("#calcScreen").attr('placeholder', 0);
        }
      });

      scope.calcSquare = function() {
        if (calcScreen.value == '') {
          calcScreen.value = $("#calcScreen").attr('placeholder');
        }
        if (isNaN(Math.pow(calcScreen.value, 2))) {
          calcScreen.value = "ERROR";
        } else {
          historyId++;
          $("#history").append("<li class='list-group-item' id='history-" + historyId + "'>" + calcScreen.value + "<sup>2</sup></li>");
          result = Math.pow(calcScreen.value, 2);
          if (String(result).indexOf('e') != -1) {
            result = "ERROR";
          }
          while (String(result).split('').length > 14) {
            result = String(result).slice(0, -1);
          }
          $("#calcScreen").val('').attr('placeholder', result);
          $("#history-" + historyId).append(" = " + result);
          scope.histDisable = false;
        }
      }

    }
  };
});