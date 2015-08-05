Time = function(id, date, commentDate, spent, delta, sold, memberCreator, username) {
	this._id = id;
	this._date = date;
	this._commentDate = commentDate;
	this._spent = spent;
	this._delta = delta;
	this._sold = sold;
	this._memberCreator = memberCreator;
	this._username = username;
	
	this._member = null;
	this._card = null;
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

Time.prototype.getSold = function() {
	return this._sold;
}

Time.prototype.setSold = function(sold) {
	this._sold = sold;
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