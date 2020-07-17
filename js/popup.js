/**
 *
 * Code behind the popup page
 */
if (typeof chrome !== "undefined" && chrome) {
    browser = chrome
}

//var getRedirectUrl = browser.extension.getBackgroundPage().getRedirectUrl;

/**
 * Build the redirect URL
 *
 * @param url
 * @returns {string}
 */
var getRedirectUrl = function (url) {
    //The URL to the relevant login page.
    var proxy = "https://ezproxy.uca.fr/login?url=";

    return proxy + url;
};

/**
 * Get the current URL
 */
function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    browser.tabs.query(queryInfo,
        function (tabs) {
            var tab = tabs[0];
            var url = tab.url;
            callback(url);
        });
}


/**
 * Listen to the login menu entry
 */
document.getElementById("popup_login").addEventListener("click", function () {
    getCurrentTabUrl(function (url) {
        var redirUrl = getRedirectUrl(url);

        browser.tabs.update({ url: redirUrl });
        window.close();
    });
});



/**
 * Listen others menu entries
 */
document.getElementById("about").addEventListener("click",
    function () {
        browser.tabs.create({ url: "https://github.com/bibnumbcu/bu-uca-extension" })
    }
)