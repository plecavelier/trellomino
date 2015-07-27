chrome.browserAction.onClicked.addListener(function(activeTab) {
	var url = chrome.extension.getURL("stats.html");
	chrome.tabs.create({
		url : url
	});
});