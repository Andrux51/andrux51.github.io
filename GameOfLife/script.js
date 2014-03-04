var generation = 0;

function initialize() {
	// Iterate through grid of cells, one column per row
	for (var y = 0; y < 10; y++) {
		for (var x = 0; x < 10; x++) {
			$("#generation-grid").append('<span id="cell-' + y + x + '" class="generation-cell">&zwj;</span>');
		}
		$("#generation-grid").append('<br/>');
	}

	createNewGeneration();
}


function createNewGeneration() {
	var survivors = 0;
	// Iterate through grid of cells, one column per row
	for (var y = 0; y < 10; y++) {
		for (var x = 0; x < 10; x++) {
			var current = $("#cell-" + y + x);
			if (generation === 0) {
				// start with a random number of live cells
				if (Math.floor(Math.random() * 2) === 1) {
					current.addClass('alive');
					survivors++;
				}
			} else {
				var live = checkIfAlive(current, x, y);
				current.removeClass('alive');
				if (live) {
					current.addClass('alive');
					survivors++;
				}
			}
		}
	}
	generation++;

	$("#generation-stats").html('<li>Generation: ' + generation + '</li><li>Living cells: ' + survivors + '</li>');

	setTimeout(function() {
		createNewGeneration();
	}, 3000);
}

function checkIfAlive(cell, x, y) {
	var neighbours = 0;
	// check surrounding cells for life, special check: do not count the "center" cell
	// in this case no check for edge cells is required, but it would be possible if necessary
	for (var i = -1; i < 2; i++) {
		for (var j = -1; j < 2; j++) {
			if (!(i === 0 && j === 0)) {
				if ($("#cell-" + (y + i) + (x + j)).hasClass('alive')) {
					neighbours++;
				}
			}
		}
	}
	// live cells need exactly 2-3 living neighbours to live, otherwise they die
	// dead cells need exactly 3 living neighbours to revive
	if (neighbours === 3 || (neighbours === 2 && cell.hasClass('alive'))) {
		return true;
	}
	return false;
}