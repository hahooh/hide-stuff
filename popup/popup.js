document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('active').addEventListener('click', function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            console.log(tabs)
            chrome.tabs.sendMessage(activeTab.id, { "message": "active" });
        });
    })

    document.getElementById('deactive').addEventListener('click', function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "message": "deactive" });
        });
    })

    document.getElementById('back').addEventListener('click', function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "message": "back" });
        });
    })
});