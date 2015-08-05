TimelineItem = function(date, previousItem) {
	this._date = date;
	this._values = {};
	this._totalValues = {};
	this._previousItem = previousItem;
}

TimelineItem.prototype.getDate = function() {
	return this._date;
}

TimelineItem.prototype.get = function(key) {
	return this._values[key];
}

TimelineItem.prototype.total = function(key) {
	if (!(key in this._totalValues)) {
		this._totalValues[key] = this._values[key];
		if (this._previousItem != null) {
			this._totalValues[key] += this._previousItem.total(key);
		}
	}
	return this._totalValues[key];
}

TimelineItem.prototype.set = function(key, value) {
	this._values[key] = value;
}

TimelineItem.prototype.add = function(key, value) {
	this._values[key] += value;
}