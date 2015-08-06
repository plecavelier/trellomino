Label = function(id, name, color) {
	this._id = id;
	this._name = name;
	this._color = color;
	this._board = null;
}

Label.prototype.getId = function() {
	return this._id;
}

Label.prototype.getName = function() {
	return this._name;
}

Label.prototype.getSelectLabel = function() {
	return this._name;
}

Label.prototype.getRealColor = function() {
	
	// TODO : to remove
	var colors = {
		"green" : "#61bd4f",
		"yellow" : "#f2d600",
		"orange" : "#ffab4a",
		"red" : "#eb5a46",
		"purple" : "#c377e0",
		"blue" : "#0079bf",
		"sky" : "#00c2e0",
		"lime" : "#51e898",
		"pink" : "#ff80ce",
		"black" : "#4d4d4d"
	}
	if (this._color in colors) {
		return colors [this._color];
	}
	return null;
}