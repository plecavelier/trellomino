Card = function(id, name) {
	this._id = id;
	this._name = name;
	this._times = {};
	this._sortedTimes = null;
	this._board = null;
	this._list = null;
}

Card.prototype.getId = function() {
	return this._id;
}

Card.prototype.getBoard = function() {
	return this._board;
}

Card.prototype.isRecurrent = function() {
	var regexp = new RegExp('\\[R\\]$', 'i');
	return !!regexp.exec(this._name);
}

Card.prototype.addTime = function(time) {
	this._times[time._id] = time;
	time._card = this;
}

Card.prototype.getTimes = function() {
	return this._times;
}

Card.prototype.getEstimate = function() {
	var firstTime = this._getFirstTime();
	if (firstTime == null) {
		return 0;
	} else {
		return firstTime.getEstimateDelta();
	}
}

Card.prototype.getSpent = function() {
	var spent = 0;
	$.each(this._times, function(index, time) {
		spent += time.getSpent();
	});
	return spent;
}

Card.prototype.getRemaining = function() {
	return this.getEstimate() + this.getDelta() - this.getSpent();
}

Card.prototype.getDelta = function() {
	if (this._sortedTimes == null) {
		this._sortTimes();
	}
	var members = {};
	var delta = 0;
	$.each(this._sortedTimes, function(index, time) {
		if (!(time.getMember().getId() in members)) {
			members[time.getMember().getId()] = true;
		} else {
			delta += time.getEstimateDelta();
		}
	});
	return delta;
}

Card.prototype._getLastTime = function() {
	if (this._sortedTimes == null) {
		this._sortTimes();
	}
	if (this._sortedTimes.length == 0) {
		return null;
	}
	return this._sortedTimes[this._sortedTimes.length - 1];
}

Card.prototype._getFirstTime = function() {
	if (this._sortedTimes == null) {
		this._sortTimes();
	}
	if (this._sortedTimes.length == 0) {
		return null;
	}
	return this._sortedTimes[0];
}

Card.prototype._getPreviousTime = function(time) {
	if (this._sortedTimes == null) {
		this._sortTimes();
	}
	if (this._sortedTimes.length == 0) {
		return null;
	}
	var index = this._sortedTimes.indexOf(time);
	if (index == 0) {
		return null;
	} else {
		return this._sortedTimes[index - 1];
	}
}

Card.prototype._sortTimes = function() {
	var thiz = this;
	this._sortedTimes = Object.keys(this._times).map(function(key) {
		return thiz._times[key];
	});
	this._sortedTimes = _.sortBy(this._sortedTimes, function(time) {
		return time._date.getTime();
	});
}