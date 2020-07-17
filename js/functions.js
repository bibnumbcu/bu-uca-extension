/**
 * Fetch the URL domains
 */
if (typeof chrome !== "undefined" && chrome) {
    browser = chrome
}


/**
 * init local storage vars
 * they can't stock boolean values
 */
function initStorageVars() {
    //if proxy is enabled
    localStorage['onProxy'] = 'false';

    //if tab url can be redirect to proxy
    localStorage['toProxy'] = 'false';

}




/**
 * Determine the domain
 */
function getDomain(url) {
    var doubleSlash = url.indexOf('//');
    var unHttp = url.substr(doubleSlash + 2);
    var domainSlash = unHttp.indexOf('/');
    var domain = unHttp.substr(0, domainSlash);

    return domain;
}


/**
 * This is where the main logic happens
 * We depending on the page's domain 
 * we determine whether we should change the extension icon, 
 * show a login button in the pop-up and, depending on the user's
 * preferences, an inpage notification
 * 
 * @param checkResult
 * @param url
 * @param tabId
 * @param userPreferences
 */
function checkRedirect(url, tabId) {
    if (localStorage['toProxy'] == 'false') {
        browser.browserAction.setIcon({ path: { "18": "img/64-no.png" } });
    }
    else if (localStorage['toProxy'] == 'true'){
        browser.tabs.executeScript(tabId, {
                    code: ''
                },
                    function () {
                        browser.tabs.executeScript(tabId, { file: "js/notification.js" }, function () { });
                    }
        );

        if (localStorage['onProxy'] == 'true'){
            browser.browserAction.setIcon({ path: { "18": "img/64-on.png" } });
        }
        else{
            browser.browserAction.setIcon({ path: { "18": "img/64-go.png" } });
        }

    }
}


/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    browser.tabs.query(queryInfo, function (tabs) {
        var tab = tabs[0];

        if (typeof (tab) === 'undefined') {
            return;
        }

        var url = tab.url;
        callback(url);
    });
}


/**
 * function to see if the url can be redirected to proxy
 *
 * @param searchUrl
 * @param callback
 */
function getProxied(searchUrl, callback) {
    var doubleslash = searchUrl.indexOf('//');
    var unhttp = searchUrl.substr(doubleslash + 2);
    var domainslash = unhttp.indexOf('/');
    var domain = unhttp.substr(0, domainslash);

    if (domain.indexOf('.') === -1) {
        return null;
    }

    var tldomain = domain.match(/[\w]+\.[\w]+$/)[0];
    var parentDomain = domain.substr(domain.indexOf('.') + 1);

    
    /**
     * Save in storage
     */
    //if url can be redirected to proxy
    if (urlsToProxy.indexOf(domain) != -1 || urlsToProxy.indexOf(parentDomain) != -1 || urlsToProxy.indexOf('www.' + parentDomain) != -1) {
        localStorage['toProxy'] = 'true';
    } else {
        // Check if we are browsing a site via the proxy
        if (domain.indexOf('ezproxy.uca.fr') !== -1){
            localStorage['onProxy'] = 'true';
            localStorage['toProxy'] = 'true';
        }
        else
        localStorage['toProxy'] = 'false';
    }
    callback();
    
}

function validateCacheEzProxy() {
    var oReq = new XMLHttpRequest();
    oReq.onload = function (e) {
        // Alert on URL update
        console.log("refresh proxy urls list");
        // We get the json for this extension, we can save it as storage
        urlsToProxy = JSON.parse(oReq.response);
    };
    // Get URL list 
    oReq.open("get", "https://intranet.bu.uca.fr/fichiers/urls-extension-bases-de-donnees.json", true);
    oReq.send();
}