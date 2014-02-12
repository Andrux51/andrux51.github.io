var enemies = [];
var enemiesPlaced = 0;
var enemiesOnCurrentMap = 0;
var totalEnemiesForMap = 5;

// Can place enemies after map load at random intervals, either chance on turn ending, or over time

function loadEnemyFromJSON(id) {
	$.ajax({
		async: false, // TODO: Make sure this is correct
		url: 'enemies/enemies.json',
		success: function(data) {
			// console.log(data[id]);
			if (totalEnemiesForMap > $(".tile[data-passable='true']").length) totalEnemiesForMap = $(".tile[data-passable='true']").length - 1; // safety measure in case of small maps; -1 because enemy cannot spawn on top of player
			if (enemiesOnCurrentMap < totalEnemiesForMap) {
				// Could probably be faster, but this should be fast enough for all intents and purposes. MtG card set loads in less than a second with hundreds of records.
				var enemyToAdd = addFunctionsToEnemyData(data[id]);
				addEnemyToGame(enemyToAdd);
				enemiesOnCurrentMap++;
			} else {
				return;
			}
		}
	});
}

function addFunctionsToEnemyData(enemy) {
	enemy.serial = enemiesPlaced;
	enemy.possibleMoves = {};
	enemy.takeTurn = function() {
		// console.log(enemy.serial + ' taking turn');
		if (enemy.tryToFindPlayer()) {
			enemy.attackPlayer();
		}
	},
	enemy.tryToFindPlayer = function() {
		var arr = [-1,0,1];
		for (var x in arr) {
			for (var y in arr) {
				if (_.isEqual(player.rect, CheckTileNearUnit(enemy, arr[x], arr[y]))) {
					return true;
				}
			}
		}
		return false;
	},
	enemy.attackPlayer = function() {
		var damageRand = _.random(enemy.damage.min,enemy.damage.max);
		console.log(enemy.name + ' attacking player! Damage dealt: '+damageRand);
		player.jq.fadeToggle(50).fadeToggle(50);
		player.health.current -= damageRand;
		UpdateUnitHealth(player);
		setUnitPopoverContent(player);
		if (player.health.current <= 0) {
			showGameOverScreen();
		}
	};
	enemy.showStats = function() {
		strStats = '<strong>Health:</strong> ' + enemy.health.current + '\/' + enemy.health.max;
		strStats += '<br /><strong>Damage:</strong> ' + enemy.damage.min + '-' + enemy.damage.max;
		strStats += '<br /><strong>Experience:</strong> ' + enemy.xp;
		strStats += '<br /><strong>Money:</strong> ' + enemy.money;
		return strStats;
	}

	return enemy;
}

	var randsUsed = [];
function addEnemyToGame(enemy) {
	var randIndex = 0;
	randIndex = _.random(0, $(".tile[data-passable='true']").length);
	while (randsUsed.indexOf(randIndex) > -1) {
		randIndex = _.random(0, $(".tile[data-passable='true']").length);
	}
	randsUsed.push(randIndex);
	$(".tile[data-passable='true']").each(function(index) {
		if (index === randIndex) {
			if (Rect($(this)).x === player.rect.x && (Rect($(this)).y + tileSize * 2) === player.rect.y) {
				return false; // Do not allow enemies to be placed on top of the player.
			}
			$("#enemies").append('<div class="enemy" id="enemy-' + enemy.serial + '" style="background:url(\'images/enemies/' + enemy.image + '\')"></div>');
			$("#enemies").append('<div class="enemyHealthBar" id="enemy-' + enemy.serial + '-healthBar"></div>');
			enemy.jq = $("#enemy-" + enemy.serial);
			enemy.jq.css({
				'position': 'absolute',
				'top': (Rect($(this)).y + tileSize * 2) + 'px',
				'left': Rect($(this)).x + 'px'
			});
			enemy.healthBar = $("#enemy-" + enemy.serial + "-healthBar");
			enemy.rect = Rect(enemy.jq);
			enemy.jq.popover({
				html: true,
				container: 'body',
				placement: 'auto right',
				title: enemy.name,
				content: enemy.showStats(),
				trigger: 'manual'
			});
			enemy.popover = enemy.jq.data('bs.popover');
			enemy.jq.mousedown(function(e) {
				if (e.button === 0) { // left-click
				}
				if (e.button === 2) { // right-click
					enemy.jq.popover('show');
				}
			});

			enemy.jq.mouseleave(function(e) {
				enemy.jq.popover('hide');
			});
			enemies.push(enemy);
			enemiesPlaced++;
		}
	});
}