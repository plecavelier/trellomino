Chart = function(times, settings) {
	this._times = times;
	this._settings = settings;
}

Chart.prototype.colors = {
	"sky" : "#7cb5ec",
	"marine" : "#434348",
	"green" : "#90ed7d",
	"orange" : "#f7a35c",
	"blue" : "#8085e9",
	"pink" : "#f15c80",
	"yellow" : "#e4d354",
	"turquoise" : "#2b908f",
	"red" : "#f45b5b",
	"cyan" : "#91e8e1"
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
		var timeline = this._createTimeline(this._times, null, null);
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

Chart.prototype._getTimeDate = function(time) {
	var date = new Date(time.getDate());
	date.setHours(0, 0, 0, 0);
	return date;
}
