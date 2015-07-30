BoardBoard = function() {
}

BoardBoard.prototype.charts = function(times) {
	return {
		"timeline" : new TimeLinesChart(times, function(time) {
			return time.getCard().getList().getId();
		}, function(time) {
			return time.getCard().getList().getName();
		}),
		"timebars" : new TimeBarsChart(times, function(time) {
			return time.getCard().getList().getId();
		}, function(time) {
			return time.getCard().getList().getName();
		}),
		"labels_pie" : new PieChart(times, function(time) {
			if (time.getCard().getLabels().length == 0) {
				return null;
			} else {
				return time.getCard().getLabels()[0].getId();
			}
		}, function(time) {
			if (time.getCard().getLabels().length == 0) {
				return null;
			} else {
				return time.getCard().getLabels()[0].getName();
			}
		}, function(time) {
			if (time.getCard().getLabels().length == 0) {
				return null;
			} else {
				return time.getCard().getLabels()[0].getRealColor();
			}
		}),
		"labels_timebars" : new TimeBarsChart(times, function(time) {
			if (time.getCard().getLabels().length == 0) {
				return null;
			} else {
				return time.getCard().getLabels()[0].getId();
			}
		}, function(time) {
			if (time.getCard().getLabels().length == 0) {
				return null;
			} else {
				return time.getCard().getLabels()[0].getName();
			}
		})
	}
}

BoardBoard.prototype.html = function() {
	return '\
	<div class="board-row">\
		<div class="board-col board-col-50p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>List timelines</h3>\
				</div>\
				<div id="timeline"></div>\
			</div>\
		</div>\
		<div class="board-col board-col-50p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>List timebars</h3>\
				</div>\
				<div id="timebars"></div>\
			</div>\
		</div>\
	</div>\
	<div class="board-row">\
		<div class="board-col board-col-50p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>Labels pie</h3>\
				</div>\
				<div id="labels_pie"></div>\
			</div>\
		</div>\
		<div class="board-col board-col-50p">\
			<div class="board-widget">\
				<div class="board-header">\
					<h3>Labels timebars</h3>\
				</div>\
				<div id="labels_timebars"></div>\
			</div>\
		</div>\
	</div>\
	';
}