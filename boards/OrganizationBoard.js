OrganizationBoard = function() {
}

OrganizationBoard.prototype.charts = function(times) {
	return {
		"timeline" : new TimeLinesChart(times, function(time) {
			return time.getCard().getBoard().getId();
		}, function(time) {
			return time.getCard().getBoard().getName();
		}),
		"timebars" : new TimeBarsChart(times, function(time) {
			return time.getCard().getBoard().getId();
		}, function(time) {
			return time.getCard().getBoard().getName();
		})
	}
}

OrganizationBoard.prototype.html = function() {
	return '\
	<div class="board-row">\
		<div class="board-col board-col-50p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>Board timebars</h3>\
				</div>\
				<div id="timeline"></div>\
			</div>\
		</div>\
		<div class="board-col board-col-50p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>Board timelines</h3>\
				</div>\
				<div id="timebars"></div>\
			</div>\
		</div>\
	</div>\
	';
}