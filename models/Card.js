Card = function(id, name) {
	this._id = id;
	this._name = name;
	this._times = {};
	this._labels = [];
	this._board = null;
	this._list = null;
	this._creationDate = null;
	this._sold = null;
}

Card.prototype.getId = function() {
	return this._id;
}

Card.prototype.getName = function() {
	return this._name;
}

Card.prototype.getBoard = function() {
	return this._board;
}

Card.prototype.getList = function() {
	return this._list;
}

Card.prototype.addTime = function(time) {
	this._times[time._id] = time;
	time.setCard(this);
}

Card.prototype.getTimes = function() {
	return this._times;
}

Card.prototype.addLabel = function(label) {
	this._labels.push(label);
}

Card.prototype.getLabels = function() {
	return this._labels;
}

Card.prototype.getCreationDate = function() {
	return this._creationDate;
}

Card.prototype.setCreationDate = function(creationDate) {
	this._creationDate = creationDate;
}

Card.prototype.getSold = function() {
	return this._sold;
}

Card.prototype.setSold = function(sold) {
	this._sold = sold;
}