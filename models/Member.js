Member = function(id, name, fullName) {
	this._id = id;
	this._name = name;
	this._fullName = fullName;
}

Member.prototype.getId = function() {
	return this._id;
}

Member.prototype.getName = function() {
	return this._name;
}

Member.prototype.getFullName = function() {
	return this._fullName;
}

Member.prototype.getDisplayedLabel = function() {
	return this._fullName;
}