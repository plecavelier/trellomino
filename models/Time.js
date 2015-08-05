Time = function(id, date, commentDate, spent, estimateDelta, memberCreator, username) {
	this._id = id;
	this._date = date;
	this._commentDate = commentDate;
	this._spent = spent;
	this._estimateDelta = estimateDelta;
	this._memberCreator = memberCreator;
	this._username = username;
	
	this._firstEstimate = null;
	this._member = null;
	this._card = null;
	
	this._delta = 0;
}

Time.prototype.getId = function() {
	return this._id;
}

Time.prototype.getCard = function() {
	return this._card;
}

Time.prototype.setCard = function(card) {
	this._card = card;
}

Time.prototype.getEstimateDelta = function() {
	return this._estimateDelta;
}

Time.prototype.getCommentDate = function() {
	return this._commentDate;
}

Time.prototype.getDate = function() {
	return this._date;
}

Time.prototype.getMember = function() {
	return this._member;
}

Time.prototype.setMember = function(member) {
	this._member = member;
}

Time.prototype.getMemberCreator = function() {
	return this._memberCreator;
}

Time.prototype.setMemberCreator = function(memberCreator) {
	this._memberCreator = memberCreator;
}

Time.prototype.getSpent = function() {
	return this._spent;
}

Time.prototype.getDelta = function() {
	return this._delta;
}

Time.prototype.setDelta = function(delta) {
	this._delta = delta;
}

Time.prototype.getFirstEstimate = function() {
	return this._firstEstimate;
}

Time.prototype.setFirstEstimate = function(firstEstimate) {
	this._firstEstimate = firstEstimate;
}

Time.prototype.getUsername = function() {
	return this._username;
}

Time.prototype.getPreviousTime = function() {
	return this._previousTime;
}

Time.prototype.setPreviousTime = function(previousTime) {
	this._previousTime = previousTime;
}