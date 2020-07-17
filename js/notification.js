/**
 * Create an iframe with the notification
 */
if (typeof chrome !== "undefined" && chrome) {
    browser = chrome
}


if (!document.getElementById("BU-UCA-ext-login-frame")) {
    var url = window.location.href;
    var iframe = document.createElement('iframe');
    iframe.id = 'BU-UCA-ext-login-frame';
    iframe.className = 'css-lama-notification';
    iframe.frameBorder = 0;
    iframe.style.position = "fixed";
    iframe.style.bottom = "0px";
    iframe.style.right = "0px";
    iframe.style.zIndex = 1000;
    iframe.style.width = "75px";
    iframe.style.height = "75px";
    iframe.src = browser.extension.getURL("notification.html?" + url);
    document.body.appendChild(iframe);
}

/**
 * Listen to events in the iframe
 * and send message to background scripts
 */
browser.runtime.onMessage.addListener(function (message) {
    //iframe.style.display = 'none';
    if (message.demand && message.demand == 'redirect') {
        window.location.href = message.text;
    }
    // if (message.demand && message.demand == 'hide_popup') {
    //     iframe.style.display = 'none';
    // }
});
