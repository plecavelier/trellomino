Timeline = function(name, color) {
	this._name = name;
	this._color = color;
	this._items = [];
}

Timeline.prototype.getName = function() {
	return this._name;
}

Timeline.prototype.setName = function(name) {
	this._name = name;
}

Timeline.prototype.getColor = function() {
	return this._color;
}

Timeline.prototype.setColor = function(color) {
	this._color = color;
}

Timeline.prototype.addItem = function(item) {
	this._items.push(item);
}

Timeline.prototype.getValues = function(key) {
	var values = [];
	$.each(this._items, function(index, item) {
		values.push([item.getDate().getTime(), item.get(key)]);
	});
	return values;
}

Timeline.prototype.sum = function(key) {
	var value = 0;
	$.each(this._items, function(index, item) {
		value += item.get(key);
	});
	return value;
}

Timeline.prototype.last = function(key) {
	if (this._items.length == 0) {
		return 0;
	}
	var lastItem = this._items[this._items.length - 1];
	return lastItem.get(key);
}