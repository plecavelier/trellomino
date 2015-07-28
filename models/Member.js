Member = function(id, name, fullName) {
	this._id = id;
	this._name = name;
	this._fullName = fullName;
}

Member.prototype.getId = function() {
	return this._id;
}

Member.prototype.getSelectLabel = function() {
	return this._fullName;
}