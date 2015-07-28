OrganizationsBoard = function() {
}

OrganizationsBoard.prototype.charts = function(times) {
	return {
		"pie" : new PieChart(times, function(time) {
			return time.getCard().getBoard().getId()
		}, function(time) {
			return time.getCard().getBoard().getName()
		}),
		"timeline" : new TimeLinesChart(times, function(time) {
			return time.getCard().getBoard().getId()
		}, function(time) {
			return time.getCard().getBoard().getName()
		}),
		"timebars" : new TimeBarsChart(times, function(time) {
			return time.getCard().getBoard().getId()
		}, function(time) {
			return time.getCard().getBoard().getName()
		})
	}
}

OrganizationsBoard.prototype.html = function() {
	return '\
	<div id="pie">test</div>\
	<div id="timeline">test</div>\
	<div id="timebars">test</div>\
	';
}