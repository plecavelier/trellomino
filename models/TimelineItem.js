TimelineItem = function(date) {
	this._date = date;
	this._values = {};
}

TimelineItem.prototype.getDate = function() {
	return this._date;
}

TimelineItem.prototype.get = function(key) {
	return this._values[key];
}

TimelineItem.prototype.set = function(key, value) {
	this._values[key] = value;
}

TimelineItem.prototype.add = function(key, value) {
	this._values[key] += value;
}