function getActiveTab(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        callback(tabs[0])
    })
}

function sendMessage(activeTab, message) {
    chrome.tabs.sendMessage(activeTab.id, { message });
    console.log(message)
}

function onActive(activeTab) {
    sendMessage(activeTab, 'active')
}

function onDeactive(activeTab) {
    sendMessage(activeTab, 'deactive')
}

function onBack(activeTab) {
    sendMessage(activeTab, 'back')
}

function onHideBack(activeTab) {
    sendMessage(activeTab, 'hideAgain')
}

function removeSave(activeTab) {
    sendMessage(activeTab, 'removeSave')
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('active').addEventListener('click', function () {
        getActiveTab(onActive)
    })

    document.getElementById('deactive').addEventListener('click', function () {
        getActiveTab(onDeactive)
    })

    document.getElementById('back').addEventListener('click', function () {
        getActiveTab(onBack)
    })

    document.getElementById('hide-again').addEventListener('click', function () {
        getActiveTab(onHideBack)
    })

    document.getElementById('remove-save').addEventListener('click', function () {
        getActiveTab(removeSave)
    })
});