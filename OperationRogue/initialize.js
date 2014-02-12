console.clear();

var tileSize = 32;
var tilearea = $("#tilearea");
var pHealth = $("#pHealthFill");

function InitializeMap() {
	UpdateUnitHealth(player);
	setUnitPopoverContent(player);
	loadMapFromJSON('maps/map' + _.random(1, 2) + '.json');
	PlacePlayer();
	for(var i = 0; i < totalEnemiesForMap; i++) {
		loadEnemyFromJSON(_.random(0,2));
	}
	// console.log(enemies);
	for(var i in enemies) {
		setUnitPopoverContent(enemies[i]);
	}

	FlashLight();
}

function UpdateUnitHealth(unit) {
	unit.healthBar.css('width', getPct(unit.health.current, unit.health.max));
	unit.healthBar.css('width', clampValue(Number(unit.healthBar.css('width').split('p')[0]), 0, 100));
	unit.healthBar.css('background-color', 'rgb(' +
		(100 - getPct(unit.health.current, unit.health.max)) +
		',' +
		(180 - getPct(unit.health.current, unit.health.max)) +
		',' +
		(255 - getPct(unit.health.current, unit.health.max)) +
		')');
	unit.health.current = clampValue(unit.health.current, 0, unit.health.max);
	if (unit === player) {
		$("#player-healthBar").html('&nbsp;' + getPct(unit.health.current, unit.health.max) + '%');
	}
}

function showGameOverScreen() {
	$("body").html('<div class="jumbotron"><h1>You lost! <small>(Score: ' + $("#score-num").html() + ')</small></h1><p>Refresh page to play again (F5)</p></div>');
	// do stuff
}

function setUnitPopoverContent(unit) {
	// strContent = '<strong>Health:</strong> ' + unit.health.current + '\/' + unit.health.max;
	// strContent += '<br /><strong>Damage:</strong> ' + unit.damage.min + '-' + unit.damage.max;
	unit.popover.options.content = unit.showStats();
}

function loadMapFromJSON(filename) {
	$.ajax({
		async: false,
		url: filename,
		success: function(data) {
			for (var i = 0; i < data.map.length; i++) { // Y-axis
				for (var j = 0; j < data.map[i].length; j++) { // X-axis
					tilearea.append('<span class="tile tile-' + data.map[i][j] + '" data-passable="' + (data.map[i][j] === 0 ? false : true) + '" data-xy="' + (j * tileSize) + ',' + ((i + 2) * tileSize) + '">&nbsp;</span>');
				}
				tilearea.append('<br />');
			}
		}
	});
}

function PlacePlayer() {
	// Be sure when placing other things that they cannot spawn on top of the player.
	var randIndex = 0;
	while (!_.every(player.possibleMoves)) { // Only place the player somewhere they can move in every direction
		randIndex = _.random(0, $(".tile[data-passable='true']").length);
		$(".tile[data-passable='true']").each(function(index) {
			var tileRect = Rect($(this));
			if (index === randIndex) {
				$("#player").css('left', tileRect.x).css('top', (tileRect.y + tileSize * 2));
				player.rect = Rect($("#player"));
				CheckForPassableTiles(player);
			}
		});
	}
}

function Rect(object) {
	return {
		x: object.position().left,
		y: object.position().top,
		width: object.width(),
		height: object.height()
	};
}

// prevent default right-click browser action
document.getElementById('viewport').oncontextmenu = function() {
	return false;
};

$("body").mousedown(function(event) {
	// $(this).focus();
	if (event.button === 0) {
		console.log('body left-clicked');
	}
	if (event.button === 2) {

		console.log('body right-clicked');
	}
});

function clampValue(val, min, max) {
	return Math.max(min, Math.min(val, max));
}

function getPct(val1, val2) {
	return Math.round(val1 / val2 * 100);
}