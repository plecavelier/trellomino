OrganizationsBoard = function() {
}

OrganizationsBoard.prototype.charts = function(cards) {
	return {
		"pie" : new PieChart(cards, function(card) {
			return card.getBoard().getId()
		}, function(card) {
			return card.getBoard().getName()
		}),
		"timeline" : new TimeLinesChart(cards, function(card) {
			return card.getBoard().getId()
		}, function(card) {
			return card.getBoard().getName()
		}),
		"timebars" : new TimeBarsChart(cards, function(card) {
			return card.getBoard().getId()
		}, function(card) {
			return card.getBoard().getName()
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