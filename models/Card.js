Card = function(id, name) {
	this._id = id;
	this._name = name;
	this._times = {};
	this._labels = [];
	this._board = null;
	this._list = null;
	this._estimate = 0;
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

Card.prototype.getSpent = function() {
	return this._spent;
}

Card.prototype.setSpent = function(spent) {
	this._spent = spent
}

Card.prototype.getDelta = function() {
	return this._delta;
}

Card.prototype.setDelta = function(delta) {
	this._delta = delta
}

Card.prototype.getEstimate = function() {
	return this._estimate;
}

Card.prototype.setEstimate = function(estimate) {
	this._estimate = estimate;
}

Card.prototype.getRemaining = function() {
	return this._remaining;
}

Card.prototype.setRemaining = function(remaining) {
	this._remaining = remaining;
}