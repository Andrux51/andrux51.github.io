var generation = angular.module('generation',['ngRoute'])
	.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$locationProvider.hashPrefix('!');
		$routeProvider.when('/', {controller: 'appController', templateUrl: 'partial.html'});
		$routeProvider.otherwise({redirectTo: '/'});
	}])
	.controller('appController',['$scope', function($scope) {
		$scope.init = function() {
			$scope.currentGeneration = 1;
			$scope.cells = [];

			// Create 10x10 grid of cells
			for(var y = 0; y < 10; y++) {
				for(var x = 0; x < 10; x++) {
					// push a new cell into the array - needs a coordinate (x,y) and a bool for alive and bool for if it will be alive (surviving to next generation)
					var newCell = {
						x: x,
						y: y,
						alive: false,
						surviving: false,
						adjacent: 0
					}
					// start with random number of live cells
					if(Math.floor(Math.random() * 2) === 1) newCell.alive = true;
					$scope.cells.push(newCell);
				}
			}
			$scope.countAlive();
		};

		$scope.advanceGeneration = function() {
			for(var k in $scope.cells) {
				var cellToCheck = $scope.cells[k];
				cellToCheck.adjacent = 0;
				// check adjacent cells for life - in this case, no check for edge cells is required, but it would be possible if necessary
				for(var i = -1; i < 2; i++) {
					for(var j = -1; j < 2; j++) {
						// do not check the "center" cell
						if(!(i === 0 && j === 0)) {
							$scope.cells.filter(function(elem, index, array) {
								if(elem.x === cellToCheck.x+i && elem.y === cellToCheck.y+j) {
									if(elem.alive) cellToCheck.adjacent++;
								}
							});
						}
					}
				}
				// live cells need exactly 2-3 living neighbours to live, otherwise they die
				// dead cells need exactly 3 living neighbours to revive
				if(cellToCheck.adjacent === 3 || (cellToCheck.adjacent === 2 && cellToCheck.alive)) {
					cellToCheck.surviving = true;
				} else {
					cellToCheck.surviving = false;
				}
			}
			$scope.handleSurvivors();
		};

		$scope.handleSurvivors = function() {
			for(var k in $scope.cells) {
				if($scope.cells[k].surviving) {
					$scope.cells[k].alive = true;
				} else {
					$scope.cells[k].alive = false;
				}
			}
			$scope.currentGeneration++;
			$scope.countAlive();
		}

		$scope.countAlive = function() {
			$scope.alive = $scope.cells.filter(function(elem) { return elem.alive; });
		}
	}]);