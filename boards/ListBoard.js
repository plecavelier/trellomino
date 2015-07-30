ListBoard = function() {
}

ListBoard.prototype.charts = function(times) {
	return {
		"timebars" : new TimeBarsChart(times, function(time) {
			return time.getCard().getId();
		}, function(time) {
			return time.getCard().getName();
		})
	}
}

ListBoard.prototype.html = function() {
	return '\
	<div class="board-row">\
		<div class="board-col board-col-100p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>List timebars</h3>\
				</div>\
				<div id="timebars"></div>\
			</div>\
		</div>\
	</div>\
	';
}