ListBoard = function() {
}

ListBoard.prototype.charts = function(times) {
	var getCardId = function(time) {
		return time.getCard().getId();
	};
	var getCardName = function(time) {
		return time.getCard().getName();
	};
	return [ [ {
		name : "Result by card",
		width : "100%",
		chart : new ResultBarChart(times, {
			getId : getCardId,
			getName : getCardName
		})
	} ] ]
}