Highcharts.setOptions({
	global : {
		useUTC : false
	}
});

Chart = function(times, settings) {
	this._times = times;
	this._settings = settings;
}

// TODO : to transfer in config

Chart.prototype.colors = {
	"blue" : "#8085e9",
	"sky" : "#7cb5ec",
	"marine" : "#434348",
	"green" : "#90ed7d",
	"yellow" : "#e4d354",
	"orange" : "#f7a35c",
	"pink" : "#f15c80",
	"red" : "#f45b5b",
	"turquoise" : "#2b908f",
	"cyan" : "#91e8e1"
}

Chart.prototype.trelloColors = {
	"blue" : "#0079bf",
	"sky" : "#00c2e0",
	"black" : "#4d4d4d",
	"green" : "#61bd4f",
	"yellow" : "#f2d600",
	"orange" : "#ffab4a",
	"pink" : "#ff80ce",
	"red" : "#eb5a46",
	"purple" : "#c377e0",
	"lime" : "#51e898"
}

Chart.prototype.render = function(containerId) {
	var thiz = this;

	var timelines = [];
	if (this.hasSeries) {
		var groups = {};

		// Group times
		$.each(this._times, function(index, time) {
			var id = thiz._settings.getId(time);
			if (!(id in groups)) {
				groups[id] = {};
				groups[id].name = thiz._settings.getName(time);
				groups[id].color = null;
				if ("getColor" in thiz._settings) {
					groups[id].color = thiz._settings.getColor(time);
				}
				groups[id].times = [];
			}
			groups[id].times.push(time);
		});

		// Create timeline for each group
		$.each(groups, function(index, group) {
			var timeline = thiz._createTimeline(group.times, group.name,
					group.color);
			timelines.push(timeline);
		});

	} else {
		var timeline = this._createTimeline(this._times, "Result", null);
		timelines.push(timeline);
	}

	console.log("subrender");
	this.subrender(containerId, timelines);
}

Chart.prototype._createTimeline = function(times, name, color) {

	var timeline = new Timeline(name, color);

	if (times.length == 0) {
		return timeline;
	}

	// Min date & max date
	var minDate = new Date(times[0].getDate());
	minDate.setHours(0, 0, 0, 0);
	var maxDate = new Date(times[times.length - 1].getDate());
	maxDate.setHours(0, 0, 0, 0);

	var indexTime = 0;
	var previousItem = null;
	for (var currentDate = new Date(minDate); currentDate <= maxDate; currentDate
			.setDate(currentDate.getDate() + 1)) {

		var item = new TimelineItem(new Date(currentDate), previousItem);

		item.set("spent", 0);
		item.set("estimate", 0);
		item.set("sold", 0);
		item.set("remain", 0);

		while (indexTime < times.length
				&& this._getTimeDate(times[indexTime]).getTime() == currentDate
						.getTime()) {
			var time = times[indexTime];

			item.add("spent", time.getSpent());
			item.add("estimate", time.getDelta());
			if (time.getCard().getSold() != null) {
				item.add("sold", time.getSold());
			} else {
				item.add("sold", time.getDelta());
			}

			indexTime++;
		}
		
		item.set("remain", item.get("estimate") - item.get("spent"));
		
		timeline.addItem(item);
		
		previousItem = item;
	}

	return timeline;
}

Chart.prototype.round = function(value) {
	if (value instanceof Object || $.isArray(value)) {
		$.each(value, function(index, item) {
			value[index] = Math.round(item * 100) / 100;
		});
	} else {
		value = Math.round(value * 100) / 100;
	}
	return value;
}

Chart.prototype._getTimeDate = function(time) {
	var date = new Date(time.getDate());
	date.setHours(0, 0, 0, 0);
	return date;
}
