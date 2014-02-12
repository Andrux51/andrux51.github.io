var possibleMoves = {};
var enemyToCheck = {};
var enemyFound = {};

$(document).keydown(function(e) {
	// console.log('%cKey pressed: ' + e.keyCode, 'background-color:#f60');

	// Debug test health increase/decrease
	if (e.keyCode === 70) player.health.current -= _.random(3, 10); // F
	if (e.keyCode === 71) player.health.current += _.random(3, 10); // G
	ControlMovement(e.keyCode);
	if (player.movementDirection) {
		player.takeTurn();
		for (var i in enemies) {
			enemies[i].takeTurn();
			setUnitPopoverContent(enemies[i]);
		}
		setUnitPopoverContent(player);
	}
	// console.log(player.rect);

	if (e.keyCode === 116 || e.keyCode === 123) return; // allow F5, F12 *for development only*

	e.preventDefault();
	e.stopPropagation();
}).keyup(function(e) {
	// console.log('Key released: '+e.keyCode);
});

function ControlMovement(key) {
	// keyboard movement - keep player on screen
	player.movementDirection = "";
	if (player.possibleMoves.up && (key === 38 || key === 104)) { // Up or Numpad 8
		player.movementDirection = "up";
	}
	if (player.possibleMoves.upleft && key === 103) { // Numpad 7
		player.movementDirection = "upleft";
	}
	if (player.possibleMoves.upright && key === 105) { // Numpad 9
		player.movementDirection = "upright";
	}
	if (player.possibleMoves.right && (key === 39 || key === 102)) { // Right or Numpad 3,6,9
		player.movementDirection = "right";
	}
	if (player.possibleMoves.down && (key === 40 || key === 98)) { // Down or Numpad 1,2,3
		player.movementDirection = "down";
	}
	if (player.possibleMoves.downleft && key === 97) { // Numpad 7
		player.movementDirection = "downleft";
	}
	if (player.possibleMoves.downright && key === 99) { // Numpad 9
		player.movementDirection = "downright";
	}
	if (player.possibleMoves.left && (key === 37 || key === 100)) { // Left or Numpad 1,4,7
		player.movementDirection = "left";
	}
}

function CheckForPassableTiles(unit) {
	// find all possible moves in 8 directions
	unit.possibleMoves = {
		up: true,
		upleft: true,
		upright: true,
		right: true,
		down: true,
		downleft: true,
		downright: true,
		left: true
	};
	if (!tilearea.find("[data-xy='" + (player.rect.x - tileSize) + "," + player.rect.y + "']").data('passable')) {
		unit.possibleMoves.left = false;
	}
	if (!tilearea.find("[data-xy='" + (player.rect.x + tileSize) + "," + player.rect.y + "']").data('passable')) {
		unit.possibleMoves.right = false;
	}
	if (!tilearea.find("[data-xy='" + player.rect.x + "," + (player.rect.y - tileSize) + "']").data('passable')) {
		unit.possibleMoves.up = false;
	}
	if (!tilearea.find("[data-xy='" + (player.rect.x - tileSize) + "," + (player.rect.y - tileSize) + "']").data('passable')) {
		unit.possibleMoves.upleft = false;
	}
	if (!tilearea.find("[data-xy='" + (player.rect.x + tileSize) + "," + (player.rect.y - tileSize) + "']").data('passable')) {
		unit.possibleMoves.upright = false;
	}
	if (!tilearea.find("[data-xy='" + player.rect.x + "," + (player.rect.y + tileSize) + "']").data('passable')) {
		unit.possibleMoves.down = false;
	}
	if (!tilearea.find("[data-xy='" + (player.rect.x - tileSize) + "," + (player.rect.y + tileSize) + "']").data('passable')) {
		unit.possibleMoves.downleft = false;
	}
	if (!tilearea.find("[data-xy='" + (player.rect.x + tileSize) + "," + (player.rect.y + tileSize) + "']").data('passable')) {
		unit.possibleMoves.downright = false;
	}
	// Disallow diagonal movement into/out of hallways
	if (!unit.possibleMoves.left && !unit.possibleMoves.upleft) {
		unit.possibleMoves.downleft = false;
	}
	if (!unit.possibleMoves.left && !unit.possibleMoves.downleft) {
		unit.possibleMoves.upleft = false;
	}
	if (!unit.possibleMoves.right && !unit.possibleMoves.upright) {
		unit.possibleMoves.downright = false;
	}
	if (!unit.possibleMoves.right && !unit.possibleMoves.downright) {
		unit.possibleMoves.upright = false;
	}
	if (!unit.possibleMoves.up && !unit.possibleMoves.upleft) {
		unit.possibleMoves.upright = false;
	}
	if (!unit.possibleMoves.up && !unit.possibleMoves.upright) {
		unit.possibleMoves.upleft = false;
	}
	if (!unit.possibleMoves.down && !unit.possibleMoves.downleft) {
		unit.possibleMoves.downright = false;
	}
	if (!unit.possibleMoves.down && !unit.possibleMoves.downright) {
		unit.possibleMoves.downleft = false;
	}
	if (!unit.possibleMoves.up && !unit.possibleMoves.down) {
		unit.possibleMoves.upleft = false;
		unit.possibleMoves.downleft = false;
		unit.possibleMoves.upright = false;
		unit.possibleMoves.downright = false;
	}
	if (!unit.possibleMoves.left && !unit.possibleMoves.right) {
		unit.possibleMoves.upleft = false;
		unit.possibleMoves.downleft = false;
		unit.possibleMoves.upright = false;
		unit.possibleMoves.downright = false;
	}
	// console.log(unit.possibleMoves);
}

function MoveUnit(unit, x, y) {
	unit.rect.x += x * tileSize;
	unit.rect.y += y * tileSize;
	unit.jq.css('left', unit.rect.x + 'px').css('top', unit.rect.y + 'px');
}

function CheckTileNearUnit(unit, x, y) {
	return {
		height: tileSize,
		width: tileSize,
		x: (unit.rect.x + x * tileSize),
		y: (unit.rect.y + y * tileSize)
	};
}

function FindObjectNearUnit(unit, array_of_objects, tile_to_check_x, tile_to_check_y) {
	for (var i in array_of_objects) {
		if (_.isEqual(array_of_objects[i].rect, CheckTileNearUnit(unit, tile_to_check_x, tile_to_check_y))) {
			return array_of_objects[i];
		}
	}
	return false;
}

function FlashLight() {
	// Not sure if I like this or not. It will probably become less relevant once screen scrolling is implemented.
	for (var i in enemies) {
		var enemy = enemies[i];
		if (enemy.rect.x >= (player.rect.x - tileSize * 2) && enemy.rect.x <= (player.rect.x + tileSize * 2) && enemy.rect.y >= (player.rect.y - tileSize * 2) && enemy.rect.y <= (player.rect.y + tileSize * 2)) {
			enemy.jq.css('opacity', 1);
		} else {
			enemy.jq.css('opacity', 0);
		}
	}
	var flashLightArray = [-3, -2, -1, 0, 1, 2, 3];
	for (var x in flashLightArray) {
		for (var y in flashLightArray) {
			if (flashLightArray[x] >= -2 && flashLightArray[x] <= 2 && flashLightArray[y] >= -2 && flashLightArray[y] <= 2) {
				tilearea.find("[data-xy='" + (player.rect.x + tileSize * flashLightArray[x]) + "," + (player.rect.y + tileSize * flashLightArray[y]) + "']").css({
					'opacity': 1
					// 'transition': 'opacity 400ms',
					// '-webkit-transition': 'opacity 400ms'
				});
			} else {
				tilearea.find("[data-xy='" + (player.rect.x + tileSize * flashLightArray[x]) + "," + (player.rect.y + tileSize * flashLightArray[y]) + "']").css({
					'opacity': 0.5
					// 'transition': 'opacity 400ms',
					// '-webkit-transition': 'opacity 400ms'
				});
			}
		}
	}
}