describe('when loaded', function() {
    var ctrl, $scope;
    beforeEach(module('generation'));
    beforeEach(inject(function($controller, $injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        ctrl = $controller('appController', { $scope: $scope });
    }));

    describe('initialize the cell grid and first generation', function() {
        it('should call a function to initialize', function() {
            spyOn($scope,'init');
            $scope.init();
            expect($scope.init).toHaveBeenCalled();
        });
        it('should start with the current generation being 1', function() {
            $scope.init();
            expect($scope.currentGeneration).toBe(1);
        });
        it('should make an array of cells', function() {
            $scope.init();
            expect(Array.isArray($scope.cells)).toBe(true);
        });
        it('should make a 10x10 "grid" using x,y coordinates for each cell', function() {
            $scope.init();
            var oneHundred = $scope.cells.filter(function(elem) {
                return elem.x == 9 && elem.y == 9;
            });
            expect(typeof oneHundred[0]).toBe('object');
            expect(Object.keys(oneHundred[0])).toEqual(['x','y','alive','surviving', 'adjacent']);
        });
        it('should randomly set at least some of the cells to alive', function() {
            $scope.init();
            var alives = $scope.cells.filter(function(elem) {
                return elem.alive;
            });
            expect(alives.length).toBeGreaterThan(0);
        });
        it('should count the number of cells that are alive', function() {
            spyOn($scope,'countAlive');
            $scope.init();
            expect($scope.countAlive).toHaveBeenCalled();
        });
    });

    describe('count the number of cells that are alive', function() {
        beforeEach(function() {
            $scope.init();
        });
        it('should call a function to do the count', function() {
            spyOn($scope,'countAlive');
            $scope.countAlive();
            expect($scope.countAlive).toHaveBeenCalled();
        });
        it('should filter the cells array for individuals that are alive', function() {
            spyOn($scope.cells,'filter');
            $scope.countAlive();
            expect($scope.cells.filter).toHaveBeenCalled();
        });
        it('should set a value to $scope.alive', function() {
            $scope.countAlive();
            expect($scope.alive).toBeDefined();
        });
    });

    describe('proceed to the next generation', function() {
        beforeEach(function() {
            $scope.init();
        });
        it('should call a function to advance to the next generation', function() {
            spyOn($scope,'advanceGeneration');
            $scope.advanceGeneration();
            expect($scope.advanceGeneration).toHaveBeenCalled();
        });
        it('should check the cells surrounding the cellToCheck to see if they are alive', function() {
            $scope.cells = [{x:0,y:0,alive:true,surviving:false,adjacent:0},{x:1,y:0,alive:true,surviving:false,adjacent:0}];
            $scope.advanceGeneration();
            expect($scope.cells[1].adjacent).toBe(1);
        });
        it('should calculate which cells will survive to the next generation', function() {
            $scope.advanceGeneration();
            var survivors = $scope.cells.filter(function(elem) {
                return elem.adjacent === 3 || (elem.adjacent === 2 && elem.alive);
            });
            var numSurvivingCorrect = survivors.every(function(elem) {
                return elem.surviving;
            });
            expect(numSurvivingCorrect).toBe(true);

            var killed = $scope.cells.filter(function(elem) {
                return !(elem.adjacent === 3 || (elem.adjacent === 2 && elem.alive));
            });
            var numKilledCorrect = killed.every(function(elem) {
                return !elem.surviving;
            });
            expect(numKilledCorrect).toBe(true);
        });
        it('should handle adjusting the survivors vs. those killed off', function() {
            spyOn($scope,'handleSurvivors');
            $scope.advanceGeneration();
            expect($scope.handleSurvivors).toHaveBeenCalled();
        });
    });

    describe('handle survivors of the current generation', function() {
        beforeEach(function() {
            $scope.init();
            $scope.advanceGeneration();
        });
        it('should call a function to handle the survivors', function() {
            spyOn($scope,'handleSurvivors');
            $scope.handleSurvivors();
            expect($scope.handleSurvivors).toHaveBeenCalled();
        });
        it('should set any cells that survive to being alive', function() {
            $scope.handleSurvivors();
            var survivors = $scope.cells.filter(function(elem) {
                return elem.surviving;
            });
            var survivorsAreAlive = survivors.every(function(elem) {
                return elem.alive;
            });
            expect(survivorsAreAlive).toBe(true);
        });
        it('should set any cells that do not survive to being not alive', function() {
            $scope.handleSurvivors();
            var killed = $scope.cells.filter(function(elem) {
                return !elem.surviving;
            });
            var killedAreDead = killed.every(function(elem) {
                return !elem.alive;
            });
            expect(killedAreDead).toBe(true);
        });
        it('should increment the currentGeneration variable', function() {
            $scope.currentGeneration = 0;
            $scope.handleSurvivors();
            expect($scope.currentGeneration).toBe(1);
        });
        it('should count the number of cells that are now alive', function() {
            spyOn($scope,'countAlive');
            $scope.handleSurvivors();
            expect($scope.countAlive).toHaveBeenCalled();
        });
    });
});