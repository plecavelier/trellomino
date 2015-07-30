OrganizationsBoard = function() {
}

OrganizationsBoard.prototype.charts = function(times) {
	return {
		"timeline" : new TimeLinesChart(times, function(time) {
			return time.getCard().getBoard().getOrganization().getId()
		}, function(time) {
			return time.getCard().getBoard().getOrganization().getName()
		}),
		"timebars" : new TimeBarsChart(times, function(time) {
			return time.getCard().getBoard().getOrganization().getId()
		}, function(time) {
			return time.getCard().getBoard().getOrganization().getName()
		})
	}
}

OrganizationsBoard.prototype.html = function() {
	return '\
	<div class="board-row">\
		<div class="board-col board-col-50p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>Organization timebars</h3>\
				</div>\
				<div id="timeline"></div>\
			</div>\
		</div>\
		<div class="board-col board-col-50p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>Organization timelines</h3>\
				</div>\
				<div id="timebars"></div>\
			</div>\
		</div>\
	</div>\
	';
}