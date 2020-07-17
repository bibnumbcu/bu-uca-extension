/**
 * this page will listen to things that interest us
 * in practice that means: whenever the URL of the page changes
 * if it does: check if it is in the list of URLs to proxy
 * if yes: show notification  
 * and show a login button on the popup screen
 */
if (typeof chrome !== "undefined" && chrome) {
    browser = chrome
}


/**
 * events for getting proxy urls list
 *
 */
browser.runtime.onInstalled.addListener(function () {
    validateCacheEzProxy();
    chrome.alarms.create("refreshProxyList", {
        "periodInMinutes": 10,
        "delayInMinutes": 2
    });
});

browser.runtime.onStartup.addListener(function () {
    validateCacheEzProxy();
    chrome.alarms.create("refreshProxyList", {
        "periodInMinutes": 10,
        "delayInMinutes": 2
    });
});

chrome.alarms.onAlarm.addListener(function () {
    validateCacheEzProxy();
});



/**
 * Start: do this whenever the browser requests a page
 *
 */
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        var url = tab.url;

        //init variables for managing icons
        initStorageVars();

        getProxied(url, function () {
            checkRedirect( url, tabId);
        });
    }
});


/**
 * Called when the user switches to the current tab
 */
browser.tabs.onActivated.addListener(function (activeInfo) {
    // Set default icon for new tab
    browser.browserAction.setIcon({ path: { "18": "img/64-no.png" } });
    
    //init variables for managing icons
    initStorageVars();
    getCurrentTabUrl(function (url) {
        getProxied(url, function () {
            checkRedirect( url, activeInfo.tabId);
        });
    });
});


/**
 *
 * This listens to events 
 */
browser.runtime.onMessage.addListener(function (message, sender) {
    browser.tabs.sendMessage(sender.tab.id, message);
});