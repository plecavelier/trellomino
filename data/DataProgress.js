DataProgress = function(callback, datas) {
	this._callback = callback;
	this._datas = datas;
	this._tasks = 0;
	this._progress = 0;
}

DataProgress.prototype.addTasks = function(tasks) {
	this._tasks += tasks;
}

DataProgress.prototype.removeTasks = function(tasks) {
	this._progress += tasks;
	this._update();
}

DataProgress.prototype._update = function() {
	var percent = Math.round((this._progress / this._tasks) * 100);
	$("#progress").find("span").html(percent);
	if (this._tasks == this._progress) {
		this._callback(this._datas);
	}
}