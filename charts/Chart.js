Highcharts.setOptions({
	global : {
		useUTC : false
	}
});

Chart = function(times, settings, workUnit) {
	this._times = times;
	this._settings = settings;
	this._workUnit = workUnit;
}

Chart.prototype.colors = {
	"black" : "#4d4d4d",
	"marine" : "#434348",
	"blue" : "#787DDB",
	"sky" : "#7cb5ec",
	"cyan" : "#91e8e1",
	"turquoise" : "#2b908f",
	"green" : "#3DD383",
	"lime" : "#90ed7d",
	"yellow" : "#e4d354",
	"orange" : "#f7a35c",
	"pink" : "#FF89A7",
	"red" : "#f45b5b",
	"purple" : "#BE94D1"
}

Chart.prototype.color = function(color) {
	if (color in this.colors) {
		return this.colors[color];
	}
	return this.colors['blue'];
}

Chart.prototype.render = function(containerId) {
	var thiz = this;

	var timelines = [];
	if (this.hasSeries) {
		var groups = {};

		// Group times
		$.each(this._times, function(index, time) {
			var id = thiz._settings.getId(time);
			if (id == null) {
				return;
			}
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

			item.add("spent", this._convertTime(time.getSpent()));
			item.add("estimate", this._convertTime(time.getDelta()));
			if (time.getCard().getSold() != null) {
				item.add("sold", this._convertTime(time.getSold()));
			} else {
				item.add("sold", this._convertTime(time.getDelta()));
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
			if ($.isArray(item)) {
				value[index][1] = Math.round(item[1] * 100) / 100;
			} else {
				value[index] = Math.round(item * 100) / 100;
			}
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

Chart.prototype.getworkUnitText = function() {
	switch (this._workUnit) {
	case "hours":
		return "Hours";

	case "days":
		return "Days";
	
	default:
		return "";
	}
}

Chart.prototype.getworkUnitSuffix = function() {
	switch (this._workUnit) {
	case "hours":
		return " hours";

	case "days":
		return " days";
	
	default:
		return "";
	}
}

Chart.prototype._convertTime = function(time) {
	switch (this._workUnit) {
	case "hours":
		return time;

	case "days":
		return time / 8;
	
	default:
		return time;
	}
}

Chart.prototype.getDefaultHeight = function() {
	return 400;
}
