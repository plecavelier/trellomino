Card = function(id, name) {
	this._id = id;
	this._name = name;
	this._times = {};
	this._labels = [];
	this._board = null;
	this._list = null;
	this._spent = 0;
	this._delta = 0;
	this._estimate = 0;
	this._remaining = 0;
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

Card.prototype.isRecurrent = function() {
	var regexp = new RegExp('\\[R\\]$', 'i');
	return !!regexp.exec(this._name);
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

Card.prototype.getTimes = function() {
	return this._times;
}

Card.prototype.getSpent = function() {
	return this._spent;
}

Card.prototype.getDelta = function() {
	return this._delta;
}

Card.prototype.getEstimate = function() {
	return this._estimate;
}

Card.prototype.getRemaining = function() {
	return this._remaining;
}

Card.prototype.calculate = function() {
	
	var thiz = this;
	
	if (Object.keys(this._times).length == 0) {
		return;
	}
	
	// Sort times by comment
	var sortedTimesByComment = this._sortTimes(function(time) {
		time.getCommentDate().getTime();
	});
	
	// Calculate card estimate
	if (sortedTimesByComment.length == 0) {
		this._estimate = 0;
	} else {
		this._estimate = sortedTimesByComment[0].getEstimateDelta();
	}
	
	// Set first time by member
	var members = {};
	var firstTimes = {};
	$.each(sortedTimesByComment, function(index, time) {
		if (time.getMember().getId() in members) {
			firstTimes[time.getId()] = false;
		} else {
			members[time.getMember().getId()] = time.getId();
			firstTimes[time.getId()] = true;
		}
	});
	
	// Sort times by tracking date
	var sortedTimesByDate = this._sortTimes(function(time) {
		time.getDate().getTime();
	});
	
	// Calculate remaining and delta
	var previousRemaining = null;
	$.each(sortedTimesByDate, function(index, time) {
		if (previousRemaining == null) {
			time.setRemaining(time.getEstimateDelta() - time.getSpent());
			time.setDelta(0);
		} else if (firstTimes[time.getId()]) {
			time.setRemaining(previousRemaining + time.getEstimateDelta() - time.getSpent());
			time.setDelta(time.getEstimateDelta());
		} else {
			time.setRemaining(previousRemaining - time.getSpent() + time.getEstimateDelta());
			time.setDelta(time.getEstimateDelta());
		}
		previousRemaining = time.getRemaining();
	});
	
	// Card remaining
	var lastTime = sortedTimesByDate[sortedTimesByDate.length - 1];
	this._remaining = lastTime.getRemaining();
	
	// Card spent and delta
	$.each(this._times, function(index, time) {
		thiz._spent += time.getSpent();
		thiz._delta += time.getDelta();
	});
}

Card.prototype._sortTimes = function(fieldFunction) {
	var thiz = this;
	var sortedTimes = Object.keys(this._times).map(function(key) {
		return thiz._times[key];
	});
	sortedTimes = _.sortBy(sortedTimes, function(time) {
		return fieldFunction(time);
	});
	return sortedTimes.reverse();
}