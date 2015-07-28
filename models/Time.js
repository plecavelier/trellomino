Time = function(id, date, text) {
	this._id = id;
	this._date = new Date(date);
	this._isTime = false;
	this._spent = null;
	this._estimateDelta = null;
	this._member = null;
	this._memberCreator = null;
	this._parseTimes(text);
}

Time.prototype.getId = function() {
	return this._id;
}

Time.prototype.getCard = function() {
	return this._card;
}

Time.prototype.getSpent = function() {
	return this._spent;
}

Time.prototype.getEstimateDelta = function() {
	return this._estimateDelta;
}

Time.prototype.getDate = function() {
	return this._date;
}

Time.prototype.isTime = function() {
	return this._isTime;
}

Time.prototype.getMember = function(member) {
	return this._member;
}

Time.prototype.setMemberCreator = function(memberCreator) {
	this._memberCreator = memberCreator;
	if (this._member == null) {
		this._member = memberCreator;
	}
}

Time.prototype._parseTimes = function(text) {
	var regexp = new RegExp('plus!( *@[a-zA-Z0-9]+)?( *-[0-9]+d)? *(-?[0-9]+\.?[0-9]*)/(-?[0-9]+\.?[0-9]*)', 'i');
	var match = regexp.exec(text);
	if (match) {
		this._isTime = true;
		this._spent = parseFloat(match[3]);
		this._estimateDelta = parseFloat(match[4]);
		
		if (match[1]) {
			var username = match[1].trim().substring(1);
			this._member = new Member(username, username, username);
		}
	}
}