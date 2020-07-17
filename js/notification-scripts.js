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
 * Get the current Url
 */
function getCurrentTabUrl(callback) {
    var url = window.location.search;
    var use_url = url.substr(1);
    callback(use_url);
}

/**
 * change image color after redirect on proxy
 */
document.addEventListener('DOMContentLoaded', function() {
    if(window.location.search.indexOf('ezproxy.uca.fr') !== -1){
        document.getElementById('BU-UCA-ext-login').innerHTML='<img id="BU-UCA-notif-img" src="img/64-on.png" />';
    }
});

/**
 * Listen to the notification link
 */
var link = document.getElementById("BU-UCA-ext-login-link");
if (link){
        link.addEventListener("click", function () {
        var redirectUrl;
        getCurrentTabUrl(function (url) {
            redirectUrl = getRedirectUrl(url);
        });

        chrome.runtime.sendMessage({
            demand: "redirect",
            text: redirectUrl
        });
    });
}

/**
 * close the notification frame
 */
var linkClose = document.getElementById("BU-UCA-ext-login-link-close");
if(linkClose){
    linkClose.addEventListener("click", function () {
        document.getElementById('BU-UCA-ext-notification').style.display = 'none';
    });

}