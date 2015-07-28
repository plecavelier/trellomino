Label = function(id, name, color) {
	this._id = id;
	this._name = name;
	this._color = color;
	this._board = null;
}

Label.prototype.getId = function() {
	return this._id;
}

Label.prototype.getSelectLabel = function() {
	return this._name;
}