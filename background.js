chrome.browserAction.onClicked.addListener(function(activeTab) {
	var url = chrome.extension.getURL("index.html");
	chrome.tabs.create({
		url : url
	});
});