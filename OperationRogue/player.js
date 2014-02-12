var player = {
	name: "Alien Rogue",
	jq: $("#player"),
	healthBar: $("#pHealthFill"),
	rect: Rect($("#player")),
	health: {
		current: 110,
		max: 110
	},
	damage: {
		min: 6,
		max: 10
	},
	xp: 0,
	money: 0,
	steps: 0,
	movementDirection: "",
	possibleMoves: {up:false},
	showStats: function() {
		strStats = '<strong>Health:</strong> ' + player.health.current + '\/' + player.health.max;
		strStats += '<br /><strong>Damage:</strong> ' + player.damage.min + '-' + player.damage.max;
		strStats += '<br /><strong>Experience:</strong> ' + player.xp;
		strStats += '<br /><strong>Money:</strong> ' + player.money;
		return strStats;
	},
	attackEnemy: function(enemy) {
		var damageRand = _.random(player.damage.min, player.damage.max);
		console.log('Player attacking '+enemy.name + '! Damage dealt: '+damageRand);
		enemy.jq.fadeToggle(50).fadeToggle(50);
		enemy.health.current -= damageRand;
		UpdateUnitHealth(enemy);
		if (enemy.health.current <= 0) {
			DoEnemyDeath(enemy);
		}
	},
	takeTurn: function() {
		// console.log("player turn begins");
		enemyToCheck = {};
		enemyFound = {};
		switch (player.movementDirection) {
			case "right":
				enemyFound = FindObjectNearUnit(player, enemies, 1, 0);
				if (!enemyFound) MoveUnit(player, 1, 0);
				break;
			case "left":
				enemyFound = FindObjectNearUnit(player, enemies, -1, 0);
				if (!enemyFound) MoveUnit(player, -1, 0);
				break;
			case "up":
				enemyFound = FindObjectNearUnit(player, enemies, 0, -1);
				if (!enemyFound) MoveUnit(player, 0, -1);
				break;
			case "upleft":
				enemyFound = FindObjectNearUnit(player, enemies, -1, -1);
				if (!enemyFound) MoveUnit(player, -1, -1);
				break;
			case "upright":
				enemyFound = FindObjectNearUnit(player, enemies, 1, -1);
				if (!enemyFound) MoveUnit(player, 1, -1);
				break;
			case "down":
				enemyFound = FindObjectNearUnit(player, enemies, 0, 1);
				if (!enemyFound) MoveUnit(player, 0, 1);
				break;
			case "downleft":
				enemyFound = FindObjectNearUnit(player, enemies, -1, 1);
				if (!enemyFound) MoveUnit(player, -1, 1);
				break;
			case "downright":
				enemyFound = FindObjectNearUnit(player, enemies, 1, 1);
				if (!enemyFound) MoveUnit(player, 1, 1);
				break;
		}
		if (enemyFound) {
			player.attackEnemy(enemyFound);
		} else {
			player.steps++;
		}
		CheckForPassableTiles(player);
		FlashLight();
		// if (enemies.length === 0) $("body").html('<div class="jumbotron"><h1>You won! <small>(Score: ' + $("#score-num").html() + ')</small></h1><p>Hooray for you and your ability to win this super easy game! Refresh page to play again (F5)</p></div>');
		// console.log('%cplayer position: [' + player.rect.x + ', ' + player.rect.y + ']', 'background-color:#bd5');
		if (player.health.current <= 0) showGameOverScreen();
		// console.log("player turn ends");
	}
};

function DoEnemyDeath(enemy) {
	// Give reward to player
	// $("#score-num").html(parseInt($("#score-num").html()) + 1); // total kills...
	player.xp += enemy.xp;
	player.money += enemy.money;
	$("#score-num").html(player.xp);
	$("#money-num").html(player.money);
	// Remove enemy from array and DOM
	$("#enemy-" + enemy.serial).remove();
	enemy.jq.popover('hide');
	enemies = _.without(enemies, enemy);
	enemiesOnCurrentMap--;
}

player.jq.popover({
	html: true,
	container: 'body',
	placement: 'auto right',
	title: player.name,
	content: player.showStats(),
	trigger: 'manual'
});
player.popover = player.jq.data('bs.popover');

player.jq.mousedown(function(e) {
	if (e.button === 0) { // left-click
	}
	if (e.button === 2) { // right-click
		player.jq.popover('show');
	}
});

player.jq.mouseleave(function(e) {
	player.jq.popover('hide');
});